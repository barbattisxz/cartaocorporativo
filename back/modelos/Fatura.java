package br.brisa.back.modelos;

import java.time.LocalDate;

public class Fatura{
    private int idFatura, idCartao, idVerificador;
    private float valorFatura;
    private LocalDate dataFatura;

    public Fatura(
        int idCartao,
        float valorFatura,
        LocalDate dataFatura,
        int idVerificador
    ) {
        this.idCartao = idCartao;
        this.idVerificador = idVerificador;
        this.valorFatura = valorFatura;
        this.dataFatura = dataFatura;
    }

    public Fatura(
        int idFatura,
        int idCartao,
        float valorFatura,
        LocalDate dataFatura,
        int idVerificador
    ) {
        this(
            idCartao,
            valorFatura,
            dataFatura,
            idVerificador
        );
        this.idFatura = idFatura;
    }

    // getters
    public int getIdFatura() { return idFatura; }
    public int getIdCartao() { return idCartao; }
    public int getIdVerificador() { return idVerificador; }
    public float getValorFatura() { return valorFatura; }
    public LocalDate getDataFatura() { return dataFatura; }
}