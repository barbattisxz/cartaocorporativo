package br.brisa.back.modelos;

import java.time.LocalDate;

public class Cartao{
    private int idCartao, idBeneficiario;
    private String numeroCC;
    private LocalDate vencimentoCartao, vencimentoFatura;

    public Cartao(
        String numeroCC,
        LocalDate vencimentoCartao,
        LocalDate vencimentoFatura,
        int idBeneficiario
    ) {
        this.numeroCC = numeroCC;
        this.vencimentoCartao = vencimentoCartao;
        this.vencimentoFatura = vencimentoFatura;
        this.idBeneficiario = idBeneficiario;
    }

    public Cartao(
        int idCartao,
        String numeroCC,
        LocalDate vencimentoCartao,
        LocalDate vencimentoFatura,
        int idBeneficiario
    ) {
        this(
            numeroCC,
            vencimentoCartao,
            vencimentoFatura,
            idBeneficiario
        );
        this.idCartao = idCartao;
    }

    // getters
    public int getIdCartao() { return idCartao; }
    public String getNumeroCC() { return numeroCC; }
    public LocalDate getVencimentoCartao() { return vencimentoCartao; }
    public LocalDate getVencimentoFatura() { return vencimentoFatura; }
    public int getIdBeneficiario() { return idBeneficiario; }

}