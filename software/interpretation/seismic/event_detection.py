"""
event_detection.py - Módulo de Deteção Sísmica e Escala de Mercalli
===================================================================
Contém a lógica de negócio para traduzir a Velocidade de Pico do Solo (PGV) 
para a Escala de Intensidade de Mercalli Modificada (MMI), exportando
a formatação de cores e descritores associados à interface visual.
"""

import math

def obter_escala_mercalli_cientifica(pgv_mms):
    """
    Aplica a equação empírica logarítmica para correlacionar
    a velocidade instrumental (PGV) com a intensidade macrossísmica.
    
    Retorna: (Grau Romano, Descrição do Dano, Cor Hexadecimal para UI)
    """
    # Conversão de mm/s para cm/s (requisito da física)
    pgv_cms = abs(pgv_mms) / 10.0 
    
    # Aplicação da fórmula empírica de Wald et al.
    imm = 3.47 * math.log10(pgv_cms) + 2.35 if pgv_cms > 0.01 else 1.0
    grau = round(imm)
    
    # Mapeamento fenomenológico rigoroso
    if grau <= 1: 
        return ("I - Não Sentido", "Instrumental", "#555555")
    elif grau in [2, 3]: 
        return ("II a III - Fraco", "Sentido em repouso", "#3399ff")
    elif grau == 4: 
        return ("IV - Ligeiro", "Vidros tremem", "#33cc33")
    elif grau == 5: 
        return ("V - Moderado", "Objetos caem", "#ffcc00")
    elif grau == 6: 
        return ("VI - Forte", "Danos no estuque", "#ff9900")
    elif grau == 7: 
        return ("VII - Muito Forte", "Danos moderados", "#ff3333")
    elif grau == 8: 
        return ("VIII - Destrutivo", "Danos severos", "#cc0000")
    else: 
        return ("IX+ - Violento", "Colapso estrutural", "#990099")
