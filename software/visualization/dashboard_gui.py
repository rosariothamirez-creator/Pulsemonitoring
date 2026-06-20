"""
dashboard_gui.py - Interface Gráfica de Gestão e Controlo (Dashboard)
===================================================================
Atua como o orquestrador principal da aplicação (Frontend).
Gere a interface em Tkinter, a leitura assíncrona do fluxo de dados (Live Feed)
e reencaminha os eventos selecionados para os motores de renderização específicos.
"""

import os
import pandas as pd
import datetime
import tkinter as tk
from tkinter import ttk, messagebox

# NOTA ARQUITETÓNICA: Numa arquitetura totalmente implementada, 
# os módulos de interpretação e renderização seriam importados aqui.
# ex: from interpretation.environmental.standards_check import obter_limite_dinamico
# ex: from visualization.amplitude_time_plot import desenhar_sismograma_ambiental

CSV_FILE = os.path.join("eventos", "amostras.csv")

class GeoDashboard:
    """
    Classe principal de interface construída sobre Tkinter.
    Mantém um loop não-bloqueante para monitorizar novos triggers sísmicos do hardware.
    """
    def __init__(self, root):
        self.root = root
        self.root.title("GeoNode - Analisador de Base de Dados")
        self.root.geometry("850x750")
        self.root.configure(bg="#161B22")
        
        # --- CONFIGURAÇÃO DE ESTILOS (Dark Mode) ---
        style = ttk.Style()
        style.theme_use('clam')
        style.configure('TFrame', background='#161B22')
        style.configure('TLabel', background='#161B22', foreground='white', font=('Segoe UI', 10))
        style.configure('Header.TLabel', font=('Segoe UI', 16, 'bold'), foreground='#58A6FF')
        style.configure('Treeview', background="#0D1117", foreground="white", fieldbackground="#0D1117", rowheight=30)
        style.map('Treeview', background=[('selected', '#3399ff')])
        style.configure('TLabelframe', background='#161B22', foreground='white')
        style.configure('TLabelframe.Label', background='#161B22', foreground='#58A6FF', font=('Segoe UI', 10, 'bold'))

        # --- INDICADOR LIVE FEED ---
        self.lbl_live = tk.Label(root, text="🟢 STATUS: A aguardar transmissão local...", bg="#161B22", fg="#3FB950", font=('Segoe UI', 10, 'bold'))
        self.lbl_live.pack(pady=(10, 0))

        ttk.Label(root, text="GeoNode: Gestão de Eventos Sísmicos", style='Header.TLabel').pack(pady=(5, 10))
        
        # --- TABELA DE EVENTOS (Treeview) ---
        frame_tabela = ttk.Frame(root)
        frame_tabela.pack(fill='both', expand=True, padx=20, pady=5)
        
        colunas = ("ID Evento", "Data e Hora", "Amostras Recolhidas")
        self.tree = ttk.Treeview(frame_tabela, columns=colunas, show='headings', height=8)
        for col in colunas:
            self.tree.heading(col, text=col)
            self.tree.column(col, anchor='center')
            
        scrollbar = ttk.Scrollbar(frame_tabela, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)
        scrollbar.pack(side='right', fill='y')
        self.tree.pack(fill='both', expand=True)

        # --- PAINEL DE CONTROLOS E PARÂMETROS ---
        frame_controlos = ttk.Frame(root)
        frame_controlos.pack(fill='x', padx=20, pady=10)
        
        f_v2 = ttk.LabelFrame(frame_controlos, text=" ⚙️ Parâmetros Dinâmicos (Funcionalidade V2.0) ")
        f_v2.pack(fill='x', pady=(0, 15))
        
        ttk.Label(f_v2, text="Limiar de Deteção (Threshold) simulado [m/s²]:").pack(side='left', padx=10, pady=10)
        self.var_threshold = tk.StringVar(value="1.5")
        ttk.Entry(f_v2, textvariable=self.var_threshold, width=10).pack(side='left', pady=10)
        ttk.Label(f_v2, text="(Aplica-se ao gráfico de Sinal Puro)", foreground='#8B949E').pack(side='left', padx=10)

        ttk.Label(frame_controlos, text="1. Selecione um evento na tabela e escolha a Análise:").pack(anchor='w', pady=5)
        
        # --- SELETORES DE MÓDULOS ---
        self.var_mod = tk.StringVar(value="Sinal")
        f_radios = ttk.Frame(frame_controlos)
        f_radios.pack(fill='x', pady=5)
        
        tk.Radiobutton(f_radios, text="Módulo Sinal Puro (Raw Data)", variable=self.var_mod, value="Sinal", bg="#161B22", fg="white", selectcolor="#30363D", command=self.atualizar_combos).pack(side='left', padx=10)
        tk.Radiobutton(f_radios, text="Módulo Ambiental (Normas)", variable=self.var_mod, value="Ambiental", bg="#161B22", fg="white", selectcolor="#30363D", command=self.atualizar_combos).pack(side='left', padx=10)
        tk.Radiobutton(f_radios, text="Módulo Sísmico (Mercalli)", variable=self.var_mod, value="Sismico", bg="#161B22", fg="white", selectcolor="#30363D", command=self.atualizar_combos).pack(side='left', padx=10)
        
        # Dicionários de Normas e Redes
        self.ops_amb = {
            "NP 2074 (Estrutura Sensível)": ("NP 2074", "Sensivel"),
            "NP 2074 (Estrutura Corrente)": ("NP 2074", "Corrente"),
            "NP 2074 (Estrutura Reforçada)": ("NP 2074", "Reforcada"),
            "DIN 4150-3 (Histórico/Sensível)": ("DIN 4150-3", "Sensivel"),
            "DIN 4150-3 (Residencial)": ("DIN 4150-3", "Residencial"),
            "DIN 4150-3 (Industrial)": ("DIN 4150-3", "Industrial"),
            "Controlo (Detonação - 0.3 mm/s)": ("Ambiental/Ocupacional", "Detonacao (Impulsiva)"),
            "Controlo (Contínua - 0.15 mm/s)": ("Ambiental/Ocupacional", "Ambiental (Continua)"),
            "BS 6472-1 (Máquinas Rotativas)": ("BS 6472-1", "Maquinas Rotativas")
        }
        self.cb_amb = ttk.Combobox(frame_controlos, values=list(self.ops_amb.keys()), state="readonly", width=40)
        self.cb_amb.current(1)
        self.cb_amb.pack(anchor='w', padx=10, pady=5)

        self.ops_sis = [
            "1. Análise Local (Sismograma + Mercalli)", 
            "2. Rede Sísmica (Trilateração de Epicentro)"
        ]
        self.cb_sis = ttk.Combobox(frame_controlos, values=self.ops_sis, state="readonly", width=45)
        self.cb_sis.current(0)
        
        # --- BOTÕES DE AÇÃO ---
        f_botoes = ttk.Frame(root)
        f_botoes.pack(fill='x', padx=20, pady=10)
        tk.Button(f_botoes, text="🔄 Forçar Leitura CSV", bg="#30363D", fg="white", font=('Segoe UI', 10), command=self.carregar_eventos).pack(side='left')
        tk.Button(f_botoes, text="🗑️ Apagar Evento", bg="#cc0000", fg="white", font=('Segoe UI', 10), command=self.apagar_evento).pack(side='left', padx=10)
        tk.Button(f_botoes, text="▶ GERAR RELATÓRIO DO EVENTO", bg="#3FB950", fg="white", font=('Segoe UI', 10, 'bold'), command=self.processar_evento).pack(side='right')

        self.ultima_contagem_eventos = 0
        self.carregar_eventos()
        self.auto_refresh() 

    def atualizar_combos(self):
        """ Alterna os menus dropdown com base no módulo selecionado """
        if self.var_mod.get() == "Ambiental":
            self.cb_sis.pack_forget()
            self.cb_amb.pack(anchor='w', padx=10, pady=5)
        elif self.var_mod.get() == "Sismico":
            self.cb_amb.pack_forget()
            self.cb_sis.pack(anchor='w', padx=10, pady=5)
        else:
            self.cb_amb.pack_forget()
            self.cb_sis.pack_forget()

    def auto_refresh(self):
        """ Ciclo de polling não-bloqueante para monitorização contínua """
        self.carregar_eventos()
        agora = datetime.datetime.now().strftime("%H:%M:%S")
        self.lbl_live.config(text=f"🟢 STATUS: LIVE FEED Ativo | Última leitura do CSV às {agora}")
        
        if self.lbl_live.cget("fg") == "#3FB950":
            self.lbl_live.config(fg="white")
        else:
            self.lbl_live.config(fg="#3FB950")
            
        self.root.after(10000, self.auto_refresh)

    def carregar_eventos(self):
        """ Lógica de ingestão de dados e reconstrução temporal """
        # [O conteúdo interno exato do vosso carregar_eventos fica aqui. 
        # Ocultado na visualização do GitHub por brevidade se desejado, 
        # mas essencial para a execução local]
        pass

    def apagar_evento(self):
        """ Lógica para remoção de eventos anómalos do CSV """
        pass

    def processar_evento(self):
        """ Ponto de injeção: Chama os motores de renderização externos baseados na seleção """
        selected = self.tree.selection()
        if not selected:
            messagebox.showwarning("Aviso", "Por favor, selecione um evento na tabela primeiro.")
            return
            
        evento_id = self.tree.item(selected[0], "tags")[0]
        # Aqui o Dashboard chamaria as funções dos ficheiros amplitude_time_plot e frequency_plot
        # ex: gerar_relatorio_ambiental(norma, estrutura, df_evento, evento_id)
        pass

if __name__ == "__main__":
    root = tk.Tk()
    app = GeoDashboard(root)
    root.mainloop()
