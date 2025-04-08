export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agendamento_consulta: {
        Row: {
          confirmado: string | null
          created_at: string
          dia_consulta: string | null
          horario_consulta: string | null
          id: number
          interesse: string | null
          mensagem_1dias: string | null
          mensagem_3dias: string | null
          mensagem_5dias: string | null
          mensagem_7dias: string | null
          mensagem_dia: string | null
          motivo: string | null
          nome_paciente: string | null
          obs: string | null
          patient_id: string | null
          professional_id: string | null
          status: string | null
          tratamento: string | null
          whatsapp: string
        }
        Insert: {
          confirmado?: string | null
          created_at?: string
          dia_consulta?: string | null
          horario_consulta?: string | null
          id?: number
          interesse?: string | null
          mensagem_1dias?: string | null
          mensagem_3dias?: string | null
          mensagem_5dias?: string | null
          mensagem_7dias?: string | null
          mensagem_dia?: string | null
          motivo?: string | null
          nome_paciente?: string | null
          obs?: string | null
          patient_id?: string | null
          professional_id?: string | null
          status?: string | null
          tratamento?: string | null
          whatsapp: string
        }
        Update: {
          confirmado?: string | null
          created_at?: string
          dia_consulta?: string | null
          horario_consulta?: string | null
          id?: number
          interesse?: string | null
          mensagem_1dias?: string | null
          mensagem_3dias?: string | null
          mensagem_5dias?: string | null
          mensagem_7dias?: string | null
          mensagem_dia?: string | null
          motivo?: string | null
          nome_paciente?: string | null
          obs?: string | null
          patient_id?: string | null
          professional_id?: string | null
          status?: string | null
          tratamento?: string | null
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "agendamento_consulta_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamento_consulta_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "clinic_users"
            referencedColumns: ["id"]
          },
        ]
      }
      analise_sentimentos: {
        Row: {
          acao_recomendada: string | null
          aprendizado_continuo: string | null
          classificacao: string | null
          comparacao_com_conversas_bem_sucedidas: string | null
          created_at: string | null
          eficacia_da_argumentacao: string | null
          estado_emocional_predominante: string | null
          grau_de_confianca_percebida: string | null
          id: number
          idade: string | null
          intensidade_da_emocao: string | null
          motivacao_principal: string | null
          motivo_da_conversa_ou_perda: string | null
          mudanca_de_tom_hesitacao: string | null
          nome: string | null
          numero_de_interacoes: string | null
          objecoes_repetidas: string | null
          origem_do_contato: string | null
          padrao_de_abandono: string | null
          palavra_chave_emocional: string | null
          palavras_chave_emocional_01: string | null
          perfil_demografico: string | null
          sugestao_de_melhoria: string | null
          tempo_medio_de_resposta: string | null
          tratamento_atual: string | null
          tratamento_de_interesse: string | null
          urgencia_percebida: string | null
          whatsapp: string
          whatsapp_valid: string | null
        }
        Insert: {
          acao_recomendada?: string | null
          aprendizado_continuo?: string | null
          classificacao?: string | null
          comparacao_com_conversas_bem_sucedidas?: string | null
          created_at?: string | null
          eficacia_da_argumentacao?: string | null
          estado_emocional_predominante?: string | null
          grau_de_confianca_percebida?: string | null
          id?: number
          idade?: string | null
          intensidade_da_emocao?: string | null
          motivacao_principal?: string | null
          motivo_da_conversa_ou_perda?: string | null
          mudanca_de_tom_hesitacao?: string | null
          nome?: string | null
          numero_de_interacoes?: string | null
          objecoes_repetidas?: string | null
          origem_do_contato?: string | null
          padrao_de_abandono?: string | null
          palavra_chave_emocional?: string | null
          palavras_chave_emocional_01?: string | null
          perfil_demografico?: string | null
          sugestao_de_melhoria?: string | null
          tempo_medio_de_resposta?: string | null
          tratamento_atual?: string | null
          tratamento_de_interesse?: string | null
          urgencia_percebida?: string | null
          whatsapp: string
          whatsapp_valid?: string | null
        }
        Update: {
          acao_recomendada?: string | null
          aprendizado_continuo?: string | null
          classificacao?: string | null
          comparacao_com_conversas_bem_sucedidas?: string | null
          created_at?: string | null
          eficacia_da_argumentacao?: string | null
          estado_emocional_predominante?: string | null
          grau_de_confianca_percebida?: string | null
          id?: number
          idade?: string | null
          intensidade_da_emocao?: string | null
          motivacao_principal?: string | null
          motivo_da_conversa_ou_perda?: string | null
          mudanca_de_tom_hesitacao?: string | null
          nome?: string | null
          numero_de_interacoes?: string | null
          objecoes_repetidas?: string | null
          origem_do_contato?: string | null
          padrao_de_abandono?: string | null
          palavra_chave_emocional?: string | null
          palavras_chave_emocional_01?: string | null
          perfil_demografico?: string | null
          sugestao_de_melhoria?: string | null
          tempo_medio_de_resposta?: string | null
          tratamento_atual?: string | null
          tratamento_de_interesse?: string | null
          urgencia_percebida?: string | null
          whatsapp?: string
          whatsapp_valid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_whatsapp_valid"
            columns: ["whatsapp_valid"]
            isOneToOne: false
            referencedRelation: "clinicorp"
            referencedColumns: ["whatsapp"]
          },
        ]
      }
      anamnesis: {
        Row: {
          answers: Json
          created_at: string
          id: string
          patient_id: string | null
          questions: Json
        }
        Insert: {
          answers: Json
          created_at?: string
          id?: string
          patient_id?: string | null
          questions: Json
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          patient_id?: string | null
          questions?: Json
        }
        Relationships: [
          {
            foreignKeyName: "anamnesis_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          created_at: string
          description: string
          id: string
          patient_id: string | null
          status: string
          total_amount: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          patient_id?: string | null
          status: string
          total_amount: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          patient_id?: string | null
          status?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "budgets_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_memory: {
        Row: {
          message: Json | null
          session_id: string
        }
        Insert: {
          message?: Json | null
          session_id: string
        }
        Update: {
          message?: Json | null
          session_id?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          id: string
          nome: string
          whatsapp: string | null
        }
        Insert: {
          id?: string
          nome: string
          whatsapp?: string | null
        }
        Update: {
          id?: string
          nome?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      clientes_followUP: {
        Row: {
          data_envio1: string | null
          data_envio2: string | null
          data_envio3: string | null
          "follow-up": string | null
          "follow-up1": string | null
          "follow-up2": string | null
          "follow-up3": string | null
          id: number
          mensagem1: string | null
          mensagem2: string | null
          mensagem3: string | null
          nome: string | null
          numero: string
          sessionId: string | null
          situacao: string | null
          ultima_atividade: string | null
        }
        Insert: {
          data_envio1?: string | null
          data_envio2?: string | null
          data_envio3?: string | null
          "follow-up"?: string | null
          "follow-up1"?: string | null
          "follow-up2"?: string | null
          "follow-up3"?: string | null
          id?: number
          mensagem1?: string | null
          mensagem2?: string | null
          mensagem3?: string | null
          nome?: string | null
          numero: string
          sessionId?: string | null
          situacao?: string | null
          ultima_atividade?: string | null
        }
        Update: {
          data_envio1?: string | null
          data_envio2?: string | null
          data_envio3?: string | null
          "follow-up"?: string | null
          "follow-up1"?: string | null
          "follow-up2"?: string | null
          "follow-up3"?: string | null
          id?: number
          mensagem1?: string | null
          mensagem2?: string | null
          mensagem3?: string | null
          nome?: string | null
          numero?: string
          sessionId?: string | null
          situacao?: string | null
          ultima_atividade?: string | null
        }
        Relationships: []
      }
      clinic_users: {
        Row: {
          contact_phone: string | null
          created_at: string
          email: string
          emergency_contact: string | null
          full_name: string
          id: string
          is_active: boolean
          notes: string | null
          profile_image: string | null
          registration_number: string | null
          role: Database["public"]["Enums"]["user_clinic_role"]
          specialty: string | null
          updated_at: string
          user_id: string
          work_schedule: Json | null
        }
        Insert: {
          contact_phone?: string | null
          created_at?: string
          email: string
          emergency_contact?: string | null
          full_name: string
          id?: string
          is_active?: boolean
          notes?: string | null
          profile_image?: string | null
          registration_number?: string | null
          role?: Database["public"]["Enums"]["user_clinic_role"]
          specialty?: string | null
          updated_at?: string
          user_id: string
          work_schedule?: Json | null
        }
        Update: {
          contact_phone?: string | null
          created_at?: string
          email?: string
          emergency_contact?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          profile_image?: string | null
          registration_number?: string | null
          role?: Database["public"]["Enums"]["user_clinic_role"]
          specialty?: string | null
          updated_at?: string
          user_id?: string
          work_schedule?: Json | null
        }
        Relationships: []
      }
      clinicorp: {
        Row: {
          contato: string | null
          creat_at: string | null
          dado_baixa_pelas_dras: string | null
          descricao: string | null
          email: string | null
          id: number
          nome: string | null
          obs: string | null
          paciente: string | null
          pausado: string | null
          procedimento: string | null
          segunda_etapa_pendente: string | null
          status: string | null
          ultima_visita: string | null
          valor_do_orcamento: string | null
          whatsapp: string
        }
        Insert: {
          contato?: string | null
          creat_at?: string | null
          dado_baixa_pelas_dras?: string | null
          descricao?: string | null
          email?: string | null
          id?: number
          nome?: string | null
          obs?: string | null
          paciente?: string | null
          pausado?: string | null
          procedimento?: string | null
          segunda_etapa_pendente?: string | null
          status?: string | null
          ultima_visita?: string | null
          valor_do_orcamento?: string | null
          whatsapp: string
        }
        Update: {
          contato?: string | null
          creat_at?: string | null
          dado_baixa_pelas_dras?: string | null
          descricao?: string | null
          email?: string | null
          id?: number
          nome?: string | null
          obs?: string | null
          paciente?: string | null
          pausado?: string | null
          procedimento?: string | null
          segunda_etapa_pendente?: string | null
          status?: string | null
          ultima_visita?: string | null
          valor_do_orcamento?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      curriculos: {
        Row: {
          cargo: string | null
          created_at: string
          id: number
          "mensagem enviado": string | null
          nome: string | null
          telefone: string
        }
        Insert: {
          cargo?: string | null
          created_at?: string
          id?: number
          "mensagem enviado"?: string | null
          nome?: string | null
          telefone: string
        }
        Update: {
          cargo?: string | null
          created_at?: string
          id?: number
          "mensagem enviado"?: string | null
          nome?: string | null
          telefone?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      exams: {
        Row: {
          created_at: string
          exam_date: string
          exam_type: string
          file_url: string | null
          id: string
          patient_id: string | null
          results: string | null
        }
        Insert: {
          created_at?: string
          exam_date: string
          exam_type: string
          file_url?: string | null
          id?: string
          patient_id?: string | null
          results?: string | null
        }
        Update: {
          created_at?: string
          exam_date?: string
          exam_type?: string
          file_url?: string | null
          id?: string
          patient_id?: string | null
          results?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exams_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_records: {
        Row: {
          amount: number
          created_at: string
          description: string
          due_date: string | null
          id: string
          paid_at: string | null
          patient_id: string | null
          status: string
          type: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          due_date?: string | null
          id?: string
          paid_at?: string | null
          patient_id?: string | null
          status: string
          type: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          due_date?: string | null
          id?: string
          paid_at?: string | null
          patient_id?: string | null
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_up_appointments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          patient_id: string | null
          professional_id: string | null
          scheduled_for: string
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          patient_id?: string | null
          professional_id?: string | null
          scheduled_for: string
          status: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          patient_id?: string | null
          professional_id?: string | null
          scheduled_for?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_appointments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "clinic_users"
            referencedColumns: ["id"]
          },
        ]
      }
      google_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          family_name: string | null
          full_name: string | null
          given_name: string | null
          google_id: string | null
          id: string
          locale: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          family_name?: string | null
          full_name?: string | null
          given_name?: string | null
          google_id?: string | null
          id: string
          locale?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          family_name?: string | null
          full_name?: string | null
          given_name?: string | null
          google_id?: string | null
          id?: string
          locale?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          analise_sentimentos: string | null
          campanha_mkt: string | null
          clinicorp: string | null
          created_at: string | null
          descricao: string | null
          desqualificado: string | null
          "e-mail": string | null
          id: number
          interesse: string | null
          name: string | null
          pausado: string | null
          retornar: string | null
          tags: string | null
          whatsapp: string
        }
        Insert: {
          analise_sentimentos?: string | null
          campanha_mkt?: string | null
          clinicorp?: string | null
          created_at?: string | null
          descricao?: string | null
          desqualificado?: string | null
          "e-mail"?: string | null
          id?: number
          interesse?: string | null
          name?: string | null
          pausado?: string | null
          retornar?: string | null
          tags?: string | null
          whatsapp: string
        }
        Update: {
          analise_sentimentos?: string | null
          campanha_mkt?: string | null
          clinicorp?: string | null
          created_at?: string | null
          descricao?: string | null
          desqualificado?: string | null
          "e-mail"?: string | null
          id?: number
          interesse?: string | null
          name?: string | null
          pausado?: string | null
          retornar?: string | null
          tags?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      message_buffer: {
        Row: {
          chat_id: string
          content: string | null
          created_at: string
          id: number
          message_id: string | null
        }
        Insert: {
          chat_id: string
          content?: string | null
          created_at?: string
          id?: number
          message_id?: string | null
        }
        Update: {
          chat_id?: string
          content?: string | null
          created_at?: string
          id?: number
          message_id?: string | null
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      orcamento_aberto: {
        Row: {
          created_at: string
          descricao1: string | null
          descricao2: string | null
          id: number
          nome: string | null
          obs: string | null
          orcamento: string | null
          tentativa1: string | null
          tentativa2: string | null
          whatsapp: string[]
        }
        Insert: {
          created_at?: string
          descricao1?: string | null
          descricao2?: string | null
          id?: number
          nome?: string | null
          obs?: string | null
          orcamento?: string | null
          tentativa1?: string | null
          tentativa2?: string | null
          whatsapp: string[]
        }
        Update: {
          created_at?: string
          descricao1?: string | null
          descricao2?: string | null
          id?: number
          nome?: string | null
          obs?: string | null
          orcamento?: string | null
          tentativa1?: string | null
          tentativa2?: string | null
          whatsapp?: string[]
        }
        Relationships: []
      }
      patient_documents: {
        Row: {
          created_at: string
          document_type: string
          document_url: string
          id: string
          patient_id: string | null
        }
        Insert: {
          created_at?: string
          document_type: string
          document_url: string
          id?: string
          patient_id?: string | null
        }
        Update: {
          created_at?: string
          document_type?: string
          document_url?: string
          id?: string
          patient_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_documents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          birth_date: string | null
          cpf: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          photo_url: string | null
          rg: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          photo_url?: string | null
          rg?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          photo_url?: string | null
          rg?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      perfis_cliente: {
        Row: {
          abordagem_recomendada: string | null
          abordagem_valor: string | null
          acoes_recomendadas: string[] | null
          ajustes_sugeridos: string[] | null
          caracteristicas_observadas: string[] | null
          cliente_id: string | null
          diagnostico_psicologico: string | null
          escore_prioridade: number | null
          estrategia_reframing: string | null
          estrategias_ativacao: string[] | null
          fase_atual: string | null
          fase_funil: string | null
          gatilhos_identificados: string[] | null
          gatilhos_primarios: string[] | null
          gatilhos_reativacao: string[] | null
          gatilhos_secundarios: string[] | null
          id: string
          informar_preco: boolean | null
          justificativa_preco: string | null
          justificativa_tag: string | null
          lead_id: number | null
          lead_whatsapp: string | null
          matriz_spin: Json | null
          narrativas_sugeridas: string[] | null
          nivel_rapport: number | null
          numero_interacoes: number | null
          objecoes_frequentes: string[] | null
          objecoes_principais: string[] | null
          orientacao_principal: string | null
          padroes_identificados: Json | null
          perfil_disc: string | null
          perfil_predominante: string | null
          perguntas_recomendadas: string[] | null
          probabilidade_conversao: number | null
          ressignificacao_recomendada: string | null
          score_prioridade: number | null
          session_id_followup: string | null
          status_atual: string | null
          tag_principal: string | null
          tecnicas_antitese: string[] | null
          tempo_medio_resposta: string | null
          tom_recomendado: string | null
          ultima_interacao: string | null
          whatsapp_clinicorp: string | null
        }
        Insert: {
          abordagem_recomendada?: string | null
          abordagem_valor?: string | null
          acoes_recomendadas?: string[] | null
          ajustes_sugeridos?: string[] | null
          caracteristicas_observadas?: string[] | null
          cliente_id?: string | null
          diagnostico_psicologico?: string | null
          escore_prioridade?: number | null
          estrategia_reframing?: string | null
          estrategias_ativacao?: string[] | null
          fase_atual?: string | null
          fase_funil?: string | null
          gatilhos_identificados?: string[] | null
          gatilhos_primarios?: string[] | null
          gatilhos_reativacao?: string[] | null
          gatilhos_secundarios?: string[] | null
          id?: string
          informar_preco?: boolean | null
          justificativa_preco?: string | null
          justificativa_tag?: string | null
          lead_id?: number | null
          lead_whatsapp?: string | null
          matriz_spin?: Json | null
          narrativas_sugeridas?: string[] | null
          nivel_rapport?: number | null
          numero_interacoes?: number | null
          objecoes_frequentes?: string[] | null
          objecoes_principais?: string[] | null
          orientacao_principal?: string | null
          padroes_identificados?: Json | null
          perfil_disc?: string | null
          perfil_predominante?: string | null
          perguntas_recomendadas?: string[] | null
          probabilidade_conversao?: number | null
          ressignificacao_recomendada?: string | null
          score_prioridade?: number | null
          session_id_followup?: string | null
          status_atual?: string | null
          tag_principal?: string | null
          tecnicas_antitese?: string[] | null
          tempo_medio_resposta?: string | null
          tom_recomendado?: string | null
          ultima_interacao?: string | null
          whatsapp_clinicorp?: string | null
        }
        Update: {
          abordagem_recomendada?: string | null
          abordagem_valor?: string | null
          acoes_recomendadas?: string[] | null
          ajustes_sugeridos?: string[] | null
          caracteristicas_observadas?: string[] | null
          cliente_id?: string | null
          diagnostico_psicologico?: string | null
          escore_prioridade?: number | null
          estrategia_reframing?: string | null
          estrategias_ativacao?: string[] | null
          fase_atual?: string | null
          fase_funil?: string | null
          gatilhos_identificados?: string[] | null
          gatilhos_primarios?: string[] | null
          gatilhos_reativacao?: string[] | null
          gatilhos_secundarios?: string[] | null
          id?: string
          informar_preco?: boolean | null
          justificativa_preco?: string | null
          justificativa_tag?: string | null
          lead_id?: number | null
          lead_whatsapp?: string | null
          matriz_spin?: Json | null
          narrativas_sugeridas?: string[] | null
          nivel_rapport?: number | null
          numero_interacoes?: number | null
          objecoes_frequentes?: string[] | null
          objecoes_principais?: string[] | null
          orientacao_principal?: string | null
          padroes_identificados?: Json | null
          perfil_disc?: string | null
          perfil_predominante?: string | null
          perguntas_recomendadas?: string[] | null
          probabilidade_conversao?: number | null
          ressignificacao_recomendada?: string | null
          score_prioridade?: number | null
          session_id_followup?: string | null
          status_atual?: string | null
          tag_principal?: string | null
          tecnicas_antitese?: string[] | null
          tempo_medio_resposta?: string | null
          tom_recomendado?: string | null
          ultima_interacao?: string | null
          whatsapp_clinicorp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "perfis_cliente_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "perfis_cliente_lead_id_lead_whatsapp_fkey"
            columns: ["lead_id", "lead_whatsapp"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id", "whatsapp"]
          },
          {
            foreignKeyName: "perfis_cliente_session_id_followup_fkey"
            columns: ["session_id_followup"]
            isOneToOne: false
            referencedRelation: "clientes_followUP"
            referencedColumns: ["sessionId"]
          },
          {
            foreignKeyName: "perfis_cliente_whatsapp_clinicorp_fkey"
            columns: ["whatsapp_clinicorp"]
            isOneToOne: false
            referencedRelation: "clinicorp"
            referencedColumns: ["whatsapp"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string
          description: string
          id: string
          patient_id: string | null
          prescribed_at: string
          professional_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          patient_id?: string | null
          prescribed_at: string
          professional_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          patient_id?: string | null
          prescribed_at?: string
          professional_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "clinic_users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          approved: boolean | null
          avatar_url: string | null
          created_at: string | null
          id: number
          role: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          approved?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          id?: never
          role?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          approved?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          id?: never
          role?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      site_pages: {
        Row: {
          chunk_number: number
          content: string
          created_at: string
          embedding: string | null
          id: number
          metadata: Json
          summary: string
          title: string
          url: string
        }
        Insert: {
          chunk_number: number
          content: string
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json
          summary: string
          title: string
          url: string
        }
        Update: {
          chunk_number?: number
          content?: string
          created_at?: string
          embedding?: string | null
          id?: number
          metadata?: Json
          summary?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          description: string | null
          file_path: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_complete_schema: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_documents: {
        Args: { filter: Json; match_count: number; query_embedding: string }
        Returns: {
          doc_id: number
          content: string
          metadata: Json
          embedding: string
        }[]
      }
      match_site_pages: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          url: string
          chunk_number: number
          title: string
          summary: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      postgres_fdw_disconnect: {
        Args: { "": string }
        Returns: boolean
      }
      postgres_fdw_disconnect_all: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      postgres_fdw_get_connections: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>[]
      }
      postgres_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      user_clinic_role:
        | "admin"
        | "dentist"
        | "receptionist"
        | "assistant"
        | "manager"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_clinic_role: [
        "admin",
        "dentist",
        "receptionist",
        "assistant",
        "manager",
      ],
    },
  },
} as const
