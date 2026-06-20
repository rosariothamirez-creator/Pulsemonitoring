"""
amplitude_time_plot.py - Renderização no Domínio do Tempo
===================================================================
Gera os sismogramas e análises cinemáticas, aplicando os temas
escuros e limites normativos definidos na arquitetura principal.
"""

def desenhar_sismograma_ambiental(ax, t_s, vx, vy, vz, linha_analise, metrica, limite_atual, norma, estrutura):
    """ Desenha o gráfico de velocidade no tempo (Módulo Ambiental) """
    ax.set_facecolor("#161B22")
    ax.tick_params(colors="#8B949E")
    ax.grid(True, color="#21262D", alpha=0.5)

    if norma == "NP 2074":
        ax.plot(t_s, vx, color='#4dd2ff', label='Eixo X', alpha=0.5)
        ax.plot(t_s, vy, color='#00ff00', label='Eixo Y', alpha=0.5)
        ax.plot(t_s, vz, color='#ff9900', label='Eixo Z', alpha=0.5)
        ax.plot(t_s, linha_analise, color='white', linewidth=2, label=metrica)
        ax.set_title(f"Análise Tri-Ortogonal ({norma} - {estrutura})", fontweight='bold', color='white')
    else:
        ax.plot(t_s, vz, color='#555555', label='Velocidade Eixo Z', alpha=0.7)
        ax.plot(t_s, linha_analise, color='#3399ff', linewidth=2, label=metrica)
        ax.set_title(f"Análise de Vibração PPV ({norma} - {estrutura})", fontweight='bold', color='white')

    ax.axhline(y=limite_atual, color='#ff3333', linestyle='--', linewidth=2, label=f'Limite: {limite_atual} mm/s')
    ax.set_ylabel("Velocidade (mm/s)")
    ax.legend(loc='upper right', facecolor="#21262D", labelcolor="white")

def desenhar_sismograma_sismico(ax, t_s, vz, pgv, cor_mercalli, grau_mercalli):
    """ Desenha o Sismograma com impacto macrossísmico (PGV) """
    ax.set_facecolor("#161B22")
    ax.tick_params(colors="#8B949E")
    ax.grid(True, color="#21262D", alpha=0.5)

    ax.plot(t_s, vz, color='white', linewidth=1.5, label='Sismograma (PGV - Eixo Z)')
    ax.axhspan(-pgv, pgv, color=cor_mercalli, alpha=0.4, label=f'Intensidade: {grau_mercalli}')
    
    ax.set_title("Sismograma no Domínio do Tempo", fontweight='bold', color='white')
    ax.set_ylabel("Velocidade (mm/s)")
    ax.legend(loc='upper right', facecolor="#21262D", labelcolor="white")
