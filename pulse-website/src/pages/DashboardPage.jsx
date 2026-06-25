import { useRef, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowLeft, Database, Cpu, Zap } from 'lucide-react'
import { useSeismic } from '../hooks/SeismicContext'

// ─── Configuração do sismógrafo ────────────────────────────────────────────────
const JANELA_S  = 5     // segundos visíveis na janela
const Y_RANGE   = 10     // m/s² — metade da escala do eixo Y
const DEADZONE  = 0.05    // m/s²

const CORES = {
  ax: '#3B82F6',
  ay: '#10B981',
  az: '#F59E0B',
}

// ─── Canvas Sismógrafo ─────────────────────────────────────────────────────────
function SismografoCanvas({ dados, eixo, cor, label }) {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)

  const dadosRef = useRef(dados)
  useEffect(() => { dadosRef.current = dados }, [dados])

  const desenhar = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr  = window.devicePixelRatio || 1
    const W    = canvas.clientWidth
    const H    = canvas.clientHeight
    if (W === 0 || H === 0) { rafRef.current = requestAnimationFrame(desenhar); return }

    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width  = W * dpr
      canvas.height = H * dpr
    }

    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)

    const PAD_L = 44
    const PAD_R = 8
    const PAD_T = 8
    const PAD_B = 20
    const plotW = W - PAD_L - PAD_R
    const plotH = H - PAD_T - PAD_B
    const mid   = PAD_T + plotH / 2
    const agora = Date.now()

    ctx.fillStyle = 'rgba(255,255,255,0.015)'
    ctx.beginPath()
    ctx.roundRect(0, 0, W, H, 12)
    ctx.fill()

    const yTicks = [-Y_RANGE, -Y_RANGE / 2, 0, Y_RANGE / 2, Y_RANGE]
    ctx.font = '9px monospace'
    ctx.textAlign = 'right'

    yTicks.forEach(v => {
      const y = mid - (v / Y_RANGE) * (plotH / 2)
      ctx.fillStyle = 'rgba(107,114,128,0.8)'
      ctx.fillText(v.toFixed(1), PAD_L - 5, y + 3)

      ctx.beginPath()
      ctx.strokeStyle = v === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)'
      ctx.lineWidth   = v === 0 ? 1 : 0.5
      ctx.moveTo(PAD_L, y)
      ctx.lineTo(PAD_L + plotW, y)
      ctx.stroke()
    })

    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(107,114,128,0.7)'
    for (let s = 0; s <= JANELA_S; s += 5) {
      const x = PAD_L + plotW * (1 - s / JANELA_S)
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'
      ctx.lineWidth   = 0.5
      ctx.moveTo(x, PAD_T)
      ctx.lineTo(x, PAD_T + plotH)
      ctx.stroke()
      ctx.fillText(s === 0 ? 'agora' : `-${s}s`, x, H - 5)
    }

    const amostras = dadosRef.current
    if (!amostras || amostras.length < 2) {
      ctx.beginPath()
      ctx.strokeStyle = cor
      ctx.lineWidth   = 1.5
      ctx.moveTo(PAD_L, mid)
      ctx.lineTo(PAD_L + plotW, mid)
      ctx.stroke()
      rafRef.current = requestAnimationFrame(desenhar)
      return
    }

    const pontos = amostras
      .map(d => {
        if (!d.t) return null
        const ts = new Date(d.t).getTime()
        if (isNaN(ts)) return null
        const segsAtras = (agora - ts) / 1000
        if (segsAtras < 0 || segsAtras > JANELA_S) return null
        const x = PAD_L + plotW * (1 - segsAtras / JANELA_S)
        const v = Math.max(-Y_RANGE, Math.min(Y_RANGE, d[eixo] ?? 0))
        const y = mid - (v / Y_RANGE) * (plotH / 2)
        return { x, y }
      })
      .filter(Boolean)

    if (pontos.length < 2) {
      ctx.beginPath()
      ctx.strokeStyle = cor
      ctx.lineWidth   = 1.5
      ctx.moveTo(PAD_L, mid)
      ctx.lineTo(PAD_L + plotW, mid)
      ctx.stroke()
      rafRef.current = requestAnimationFrame(desenhar)
      return
    }

    const grad = ctx.createLinearGradient(0, PAD_T, 0, PAD_T + plotH)
    grad.addColorStop(0,   cor + '30')
    grad.addColorStop(0.5, cor + '10')
    grad.addColorStop(1,   cor + '00')

    ctx.beginPath()
    ctx.moveTo(pontos[0].x, mid)
    pontos.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.lineTo(pontos[pontos.length - 1].x, mid)
    ctx.closePath()
    ctx.fillStyle = grad
    ctx.fill()

    ctx.beginPath()
    ctx.strokeStyle = cor
    ctx.lineWidth   = 1.5
    ctx.lineJoin    = 'miter'
    pontos.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
    ctx.stroke()

    const ultimo = pontos[pontos.length - 1]
    ctx.beginPath()
    ctx.arc(ultimo.x, ultimo.y, 3, 0, Math.PI * 2)
    ctx.fillStyle = cor
    ctx.fill()

    rafRef.current = requestAnimationFrame(desenhar)
  }, [cor, eixo])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(desenhar)
    return () => cancelAnimationFrame(rafRef.current)
  }, [desenhar])

  const ultimoValor = dados[dados.length - 1]?.[eixo] ?? 0

  return (
    <div className="bg-pulse-surface/50 border border-white/8 rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cor }} />
          <span className="text-sm font-bold text-white">{label}</span>
        </div>
        <span className="text-xs font-mono" style={{ color: cor }}>
          {Number(ultimoValor).toFixed(4)} m/s²
        </span>
      </div>
      <div style={{ width: '100%', height: 120, position: 'relative' }}>
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
      </div>
    </div>
  )
}

// ─── Componente principal ──────────────────────────────────────────────────────
export default function Dashboard() {
  const {
    dados,
    totalAmostras,
    ultimoEvento,
  } = useSeismic()

  const ultimoPonto = dados[dados.length - 1]

  const pico = useMemo(() =>
    dados.reduce(
      (acc, d) => ({
        ax: Math.max(acc.ax, Math.abs(d.ax)),
        ay: Math.max(acc.ay, Math.abs(d.ay)),
        az: Math.max(acc.az, Math.abs(d.az)),
      }),
      { ax: 0, ay: 0, az: 0 }
    ),
    [dados]
  )

  return (
    <div className="min-h-screen bg-pulse-darker text-white">

      {/* ── Barra de topo ──────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-pulse-darker/90 backdrop-blur-xl border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              Home
            </Link>
            <span className="text-white/20">|</span>
            <span className="text-sm font-bold text-white">Pulse Monitor</span>
            <span className="hidden sm:block text-xs font-mono text-gray-500">
              PULSE-001 · ADXL345
            </span>
          </div>
          <span className="text-xs font-mono text-gray-500">{ultimoEvento}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">

        {/* ── Cartões de estatísticas ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: 'Amostras recebidas',
              value: totalAmostras.toLocaleString('pt'),
              icon: Database,
              color: 'text-pulse-blue',
              bg: 'bg-pulse-blue/10 border-pulse-blue/20',
            },
            {
              label: 'Pico |AX|',
              value: `${pico.ax.toFixed(3)} m/s²`,
              icon: Activity,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10 border-blue-500/20',
            },
            {
              label: 'Pico |AY|',
              value: `${pico.ay.toFixed(3)} m/s²`,
              icon: Activity,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/20',
            },
            {
              label: 'Pico |AZ|',
              value: `${pico.az.toFixed(3)} m/s²`,
              icon: Zap,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10 border-amber-500/20',
            },
          ].map((c) => (
            <div key={c.label} className={`glass border ${c.bg} rounded-2xl p-4 flex flex-col gap-2`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400 uppercase tracking-wider">{c.label}</span>
                <c.icon size={14} className={c.color} />
              </div>
              <span className={`text-xl font-black font-mono ${c.color}`}>{c.value}</span>
            </div>
          ))}
        </div>

        {/* ── Leituras instantâneas ───────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { eixo: 'ax', cor: CORES.ax, label: 'AX — Eixo X' },
            { eixo: 'ay', cor: CORES.ay, label: 'AY — Eixo Y' },
            { eixo: 'az', cor: CORES.az, label: 'AZ — Eixo Z' },
          ].map(({ eixo, cor, label }) => (
            <div key={eixo} className="glass border border-white/8 rounded-2xl p-4 text-center">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{label}</div>
              <div className="text-2xl font-black font-mono" style={{ color: cor }}>
                {ultimoPonto ? Number(ultimoPonto[eixo]).toFixed(4) : '—'}
              </div>
              <div className="text-[10px] text-gray-600 mt-0.5">m/s²</div>
            </div>
          ))}
        </div>

        {/* ── Gráficos canvas ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">
              Aceleração em tempo real
              <span className="ml-2 text-xs text-gray-500 font-normal">
                (janela de {JANELA_S}s · deadzone ±{DEADZONE} m/s²)
              </span>
            </h2>
            {!dados.length && (
              <span className="text-xs text-gray-600 italic">À espera de dados do sensor…</span>
            )}
          </div>

          {/* Gráficos centrados a metade da largura */}
          <div className="max-w-2xl mx-auto w-full flex flex-col gap-4">
            <SismografoCanvas dados={dados} eixo="ax" cor={CORES.ax} label="Eixo X (AX)" />
            <SismografoCanvas dados={dados} eixo="ay" cor={CORES.ay} label="Eixo Y (AY)" />
            <SismografoCanvas dados={dados} eixo="az" cor={CORES.az} label="Eixo Z (AZ)" />
          </div>
        </div>

        {/* ── Tabela das últimas amostras ─────────────────────────────────── */}
        <div className="glass border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/8 flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Últimas amostras</span>
            <span className="text-[10px] font-mono text-gray-500">{dados.length} pontos em memória</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-white/6">
                  {['Timestamp', 'AX (m/s²)', 'AY (m/s²)', 'AZ (m/s²)'].map((h) => (
                    <th key={h} className="px-4 py-2 text-left text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {dados.slice(-15).reverse().map((d, i) => (
                  <tr key={i} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-1.5 text-gray-400">{d.t}</td>
                    <td className="px-4 py-1.5" style={{ color: CORES.ax }}>{Number(d.ax).toFixed(5)}</td>
                    <td className="px-4 py-1.5" style={{ color: CORES.ay }}>{Number(d.ay).toFixed(5)}</td>
                    <td className="px-4 py-1.5" style={{ color: CORES.az }}>{Number(d.az).toFixed(5)}</td>
                  </tr>
                ))}
                {!dados.length && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-600 italic">
                      Sem dados recebidos ainda — aguarda a ligação do sensor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Rodapé ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between text-[10px] font-mono text-gray-600 pb-2">
          <span>PULSE v1.0 · ADXL345 · Supabase</span>
          <span className="flex items-center gap-1.5">
            <Cpu size={10} />
            Cloud: Supabase
          </span>
        </div>
      </div>
    </div>
  )
}
