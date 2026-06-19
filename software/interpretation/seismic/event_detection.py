"""
event_detection.py - Módulo de Deteção Sísmica e Escala de Mercalli
===================================================================
Contém a lógica de negócio para processar eventos transitórios e traduzir 
a Velocidade de Pico do Solo (PGV) para a Escala de Intensidade de 
Mercalli Modificada (MMI), baseada nas correlações de Wald et al. (1999).
"""

import numpy as np

def calcular_pgv(vx, vy, vz):
    """
    Calcula a Velocidade de Pico do Solo (Peak Ground Velocity - PGV).
    Na sismologia moderna, em contraste com a raiz quadrada geométrica do 
    PVS estrutural, o PGV é frequentemente analisado pelo valor máximo 
    absoluto registado nos eixos ortogonais.
    
    Retorna:
    pgv_mm_s (float) : Velocidade máxima absoluta registada (mm/s).
    """
    # Extrai o pico máximo absoluto transversal a todos os eixos
    pgv = float(np.max([np.max(np.abs(vx)), np.max(np.abs(vy)), np.max(np.abs(vz))]))
    return pgv

def classificar_mercalli(pgv_mm_s):
    """
    Mapeia a Velocidade de Pico do Solo para a Escala de Mercalli Modificada.
    Os limiares refletem a progressão logarítmica da energia dissipada,
    convertendo medições instrumentais em perceção e impacto estrutural.
    
    Parâmetros:
    pgv_mm_s : Velocidade de pico (mm/s). As equações empíricas originais
               utilizam cm/s (1 cm/s = 10 mm/s).
               
    Retorna:
    (grau_romano, classe_perigo) : O grau MMI e a sua descrição fenomenológica.
    """
    if pgv_mm_s < 1.0:
        return "I", "Instrumental (Não sentido pela maioria das pessoas)"
    elif pgv_mm_s < 11.0:
        return "II - III", "Ligeiro (Sentido em repouso nos andares superiores)"
    elif pgv_mm_s < 34.0:
        return "IV", "Moderado (Sentido no interior; janelas tremem)"
    elif pgv_mm_s < 81.0:
        return "V", "Forte (Sentido no exterior; objetos caem)"
    elif pgv_mm_s < 160.0:
        return "VI", "Bastante Forte (Sentido por todos; danos em estuque)"
    elif pgv_mm_s < 310.0:
        return "VII", "Muito Forte (Danos ligeiros em estruturas correntes)"
    elif pgv_mm_s < 600.0:
        return "VIII", "Ruinoso (Danos severos; queda de chaminés e muros)"
    else:
        return "IX+", "Destrutivo (Danos estruturais generalizados / Colapso)"

def validar_assinatura_sismica(pgv_mm_s, frequencia_dominante):
    """
    Filtro de falsos positivos para garantir que um impacto local de alta
    frequência (ex: queda de um objeto pesado junto ao sensor) não é
    classificado como um evento sísmico regional.
    
    Retorna um booleano de validação e a mensagem de estado.
    """
    # Sismos libertam energia predominantemente em baixas frequências.
    # Impactos mecânicos locais geram picos transientes de alta frequência.
    if frequencia_dominante > 20.0 and pgv_mm_s < 34.0:
        return False, "Rejeitado: Anomalia Local / Ruído de Alta Frequência"
    
    return True, "Assinatura Sísmica Regional Validada"
