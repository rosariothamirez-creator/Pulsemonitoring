import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

// ─── Configuração ──────────────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://lyjlhimejffjbsefonqh.supabase.co'
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY ?? 'sb_publishable_8dc3LXKIAluAkGgH4kqDBQ_SJ2gC2QB'

const MAX_PONTOS = 300
const DEADZONE   = 0.05   // m/s²

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ─── Utilitários ───────────────────────────────────────────────────────────────
function applyDeadzone(v) {
  return Math.abs(v) <= DEADZONE ? 0 : v
}

function labelCurto(t) {
  if (!t) return ''
  const partes = String(t).split(' ')
  return partes[1]?.split('.')[0] ?? t
}

// Buffer sempre cheio (zeros à esquerda) — garante rolo contínuo no recharts
export function withPadding(arr, size = MAX_PONTOS) {
  if (arr.length >= size) return arr
  const padding = Array.from({ length: size - arr.length }, () => ({
    t: null, t_label: '', ax: 0, ay: 0, az: 0,
  }))
  return [...padding, ...arr]
}

// ─── Context ───────────────────────────────────────────────────────────────────
const SeismicContext = createContext(null)

export function SeismicProvider({ children }) {
  const [dados,         setDados]  = useState([])
  const [ligado,        setLigado] = useState(false)
  const [totalAmostras, setTotal]  = useState(0)
  const [ultimoEvento,  setUltimo] = useState('—')
  const [erro,          setErro]   = useState(null)

  // Guarda o último evento_id visto para não buscar duplicados
  const ultimoIdRef = useRef(0)

  const adicionarAmostras = useCallback((novas) => {
    setDados((prev) => [
      ...prev,
      ...novas.map((a) => ({
        t:       a.t,
        t_label: labelCurto(a.t),
        ax: applyDeadzone(parseFloat(a.ax) || 0),
        ay: applyDeadzone(parseFloat(a.ay) || 0),
        az: applyDeadzone(parseFloat(a.az) || 0),
      })),
    ].slice(-MAX_PONTOS))
    setTotal((n) => n + novas.length)
    if (novas.length) setUltimo(labelCurto(novas[novas.length - 1].t))
  }, [])

  // Histórico inicial — vem do Supabase
  useEffect(() => {
    supabase
      .from('amostras')
      .select('evento_id, data_hora, ax_ms2, ay_ms2, az_ms2')
      .order('evento_id', { ascending: false })
      .limit(MAX_PONTOS)
      .then(({ data, error }) => {
        if (error) { console.error('[SUPABASE]', error); return }
        if (!data?.length) return
        // Guarda o evento_id mais recente para o Realtime saber de onde continuar
        ultimoIdRef.current = data[0].evento_id
        const hist = data.reverse().map((r) => ({
          evento_id: r.evento_id,
          t:         r.data_hora,
          ax:        r.ax_ms2 ?? 0,
          ay:        r.ay_ms2 ?? 0,
          az:        r.az_ms2 ?? 0,
        }))
        adicionarAmostras(hist)
      })
  }, [adicionarAmostras])

  // Realtime — só busca amostras mais recentes que a última vista
  useEffect(() => {
    const canal = supabase
      .channel('amostras-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'amostras' },
        async () => {
          const { data, error } = await supabase
            .from('amostras')
            .select('evento_id, data_hora, ax_ms2, ay_ms2, az_ms2')
            .order('evento_id', { ascending: true })
            .gt('evento_id', ultimoIdRef.current)
            .limit(50)

          if (error) { console.error('[SUPABASE REALTIME]', error); return }
          if (!data?.length) return

          // Atualiza o último id visto
          ultimoIdRef.current = data[data.length - 1].evento_id

          adicionarAmostras(data.map((r) => ({
            evento_id: r.evento_id,
            t:         r.data_hora,
            ax:        r.ax_ms2 ?? 0,
            ay:        r.ay_ms2 ?? 0,
            az:        r.az_ms2 ?? 0,
          })))
        }
      )
      .subscribe((status) => {
        setLigado(status === 'SUBSCRIBED')
        if (status === 'SUBSCRIBED') setErro(null)
        else setErro('Sem ligação ao Supabase Realtime…')
      })

    return () => { supabase.removeChannel(canal) }
  }, [adicionarAmostras])

  // waveformData: buffer sempre com MAX_PONTOS entradas
  const waveformData = withPadding(dados, MAX_PONTOS)

  return (
    <SeismicContext.Provider value={{
      dados,
      waveformData,
      ligado,
      totalAmostras,
      ultimoEvento,
      erro,
      MAX_PONTOS,
      DEADZONE,
    }}>
      {children}
    </SeismicContext.Provider>
  )
}

export function useSeismic() {
  const ctx = useContext(SeismicContext)
  if (!ctx) throw new Error('useSeismic must be used inside <SeismicProvider>')
  return ctx
}
