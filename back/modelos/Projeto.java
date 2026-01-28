package br.brisa.back.modelos;

import java.time.LocalDate;

public class Projeto{
    private int idProjeto;
    float orcamento;
    private String sigla, nome, agenciaFomento, numeroProcesso;
    private LocalDate dataInicio, dataFim;

    public Projeto(
        float orcamento,
        String sigla,
        String nome,
        String agenciaFomento,
        String numeroProcesso,
        LocalDate dataInicio,
        LocalDate dataFim
    ) {
        this.orcamento = orcamento;
        this.sigla = sigla;
        this.nome = nome;
        this.agenciaFomento = agenciaFomento;
        this.numeroProcesso = numeroProcesso;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
    }

    public Projeto(
        int idProjeto,
        String sigla,
        String nome,
        String agenciaFomento,
        String numeroProcesso,
        float orcamento,
        LocalDate dataInicio,
        LocalDate dataFim
    ) {
        this(
            orcamento,
            sigla,
            nome,
            agenciaFomento,
            numeroProcesso,
            dataInicio,
            dataFim
        );
        this.idProjeto = idProjeto;
    }

    // getters
    public int getIdProjeto() { return idProjeto; }
    public float getOrcamento() { return orcamento; }
    public String getSigla() { return sigla; }
    public String getNome() { return nome; }
    public String getAgenciaFomento() { return agenciaFomento; }
    public String getNumeroProcesso() { return numeroProcesso; }
    public LocalDate getDataInicial() { return dataInicio; }
    public LocalDate getDataFinal() { return dataFim; }
}