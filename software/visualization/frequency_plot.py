"""
frequency_plot.py - Motor de Renderização no Domínio da Frequência
===================================================================
Gera o espetro de energia a partir da Transformada de Fourier (FFT).
Isola e destaca a frequência de ressonância dominante do evento
para avaliação de dependência de frequência das normas europeias.
"""

import matplotlib.pyplot as plt

def plotar_espetro_fft(frequencias, amplitudes, freq_dominante=None, titulo="Espetro de Frequências (FFT)"):
    """
    Renderiza a distribuição de energia espetral.
    
    Parâmetros:
    frequencias    : Array das frequências mapeadas (Hz).
    amplitudes     : Array com a magnitude normalizada de cada frequência.
    freq_dominante : Float com a frequência de ressonância (Hz) para destaque.
    titulo         : String para o cabeçalho do gráfico.
    
    Retorna:
    fig : Objeto Figure do Matplotlib renderizado em memória.
    """
    fig, ax = plt.subplots(figsize=(10, 5))
    
    # Plotagem da curva espetral (Amplitude vs Frequência)
    ax.plot(frequencias, amplitudes, color='#9467bd', linewidth=1.5, label="Amplitude Espetral")
    
    # Marcador visual vertical para a Frequência Dominante
    if freq_dominante is not None and freq_dominante > 0:
        ax.axvline(x=freq_dominante, color='orange', linestyle='-.', linewidth=2, 
                   label=f"Frequência Dominante: {freq_dominante:.2f} Hz")
        
    # Formatação académica do layout
    ax.set_title(titulo, fontsize=12, fontweight='bold')
    ax.set_xlabel("Frequência [Hz]", fontsize=10)
    ax.set_ylabel("Amplitude Normalizada", fontsize=10)
    
    # Otimização da Janela de Visualização:
    # Foca o eixo horizontal no espetro de interesse estrutural (tipicamente < 100 Hz).
    # Se a frequência dominante for alta, garante que ela fica visível no gráfico.
    limite_superior_x = max(100.0, freq_dominante * 2 if freq_dominante else 100.0)
    ax.set_xlim(0, limite_superior_x)
    
    # Garante que o eixo vertical começa estritamente no zero
    ax.set_ylim(bottom=0)
    
    ax.grid(True, linestyle=':', alpha=0.6)
    ax.legend(loc='upper right', fontsize=9, framealpha=0.9)
    
    fig.tight_layout()
    
    return fig
