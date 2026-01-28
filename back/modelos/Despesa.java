package br.brisa.back.modelos;

import java.time.LocalDate;

public class Despesa{
    private int idDespesa, idTipoDespesa, idBeneficiario;
    private Integer idProjeto;
    private float valor;
    private String cnpjFornecedor;
    private LocalDate dataDespesa;
    private byte[] imagemNota;

    public Despesa(
        int idTipoDespesa,
        int idBeneficiario,
        Integer idProjeto,
        LocalDate dataDespesa,
        float valor,
        String cnpjFornecedor,
        byte[] imagemNota
    ) {
        this.idTipoDespesa = idTipoDespesa;
        this.idBeneficiario = idBeneficiario;
        this.idProjeto = idProjeto;
        this.dataDespesa = dataDespesa;
        this.valor = valor;
        this.cnpjFornecedor = cnpjFornecedor;
        this.imagemNota = imagemNota;
    }

    public Despesa(
        int idDespesa,
        int idTipoDespesa,
        int idBeneficiario,
        Integer idProjeto,
        LocalDate dataDespesa,
        float valor,
        String cnpjFornecedor,
        byte[] imagemNota
    ) {
        this(
            idTipoDespesa,
            idBeneficiario,
            idProjeto,
            dataDespesa,
            valor,
            cnpjFornecedor,
            imagemNota
        );
        this.idDespesa = idDespesa;
    }

    // getters
    public int getIdDespesa() { return idDespesa; }
    public int getIdTipoDespesa() { return idTipoDespesa; }
    public int getIdBeneficiario() { return idBeneficiario; }
    public Integer getIdProjeto() { return idProjeto; }
    public LocalDate getDataDespesa() { return dataDespesa; }
    public float getValor() { return valor; }
    public String getCnpjFornecedor() { return cnpjFornecedor; }
    public byte[] getImagemNota() { return imagemNota; }

}