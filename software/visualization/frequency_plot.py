"""
frequency_plot.py - Renderização no Domínio da Frequência
===================================================================
Gera os espetros de Transformada de Fourier, incluindo a injeção
das zonas de risco normativo baseadas na frequência.
"""

def desenhar_espetro_ambiental(ax, xf, yf, freq_pico, norma):
    """ Desenha o espetro de frequência com as zonas de risco estrutural """
    ax.set_facecolor("#161B22")
    ax.tick_params(colors="#8B949E")
    ax.grid(True, color="#21262D", alpha=0.5)

    ax.plot(xf, yf, color='#cc33ff', label='Espectro FFT')
    ax.axvline(x=freq_pico, color='white', linestyle='--', label=f'Freq. Dominante: {freq_pico:.1f} Hz')
    
    # Zonas de Risco Baseadas na Norma
    if norma in ["NP 2074", "DIN 4150-3"]:
        lim_alta = 40 if norma == "NP 2074" else 50
        ax.axvspan(0, 10, color='red', alpha=0.15, label='Baixa Freq - [0-10]Hz')
        ax.axvspan(10, lim_alta, color='yellow', alpha=0.15, label=f'Média Freq - [10-{lim_alta}]Hz')
        ax.axvspan(lim_alta, 70, color='green', alpha=0.15, label=f'Alta Freq - >{lim_alta} Hz')
        
    ax.set_xlim(0, 70)
    ax.set_xlabel("Frequência (Hz)")
    ax.set_title("Espectro Dinâmico e Zonas de Risco Estrutural", fontweight='bold', color='white')
    ax.legend(loc='upper right', facecolor="#21262D", labelcolor="white")

def desenhar_espetro_sismico(ax, xf, yf, freq_pico):
    """ Desenha o espetro focado em baixas frequências sismológicas """
    ax.set_facecolor("#161B22")
    ax.tick_params(colors="#8B949E")
    ax.grid(True, color="#21262D", alpha=0.5)

    ax.plot(xf, yf, color='#ff6666', label='Assinatura Tectónica')
    ax.axvline(x=freq_pico, color='white', linestyle='--', label=f'Freq. Dominante: {freq_pico:.1f} Hz')
    
    ax.set_xlim(0, 20) 
    ax.set_title("Espectro de Amplitude (FFT)", fontweight='bold', color='white')
    ax.set_xlabel("Frequência (Hz)")
    ax.legend(loc='upper right', facecolor="#21262D", labelcolor="white")
