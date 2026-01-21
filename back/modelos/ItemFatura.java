package br.brisa.back.modelos;

import java.time.LocalDate;

public class ItemFatura{
    private int idItem, idFatura, idDespesa;
    private float valorItem;
    private LocalDate dataItem; //Inútil? Considerando que já há data na despesa.
    private String statusAnalise, justificativa;

    public ItemFatura(
        int idFatura,
        int idDespesa,
        float valorItem,
        LocalDate dataItem,
        String statusAnalise,
        String justificativa
    ) {
        this.idFatura = idFatura;
        this.idDespesa = idDespesa;
        this.valorItem = valorItem;
        this.dataItem = dataItem;
        this.statusAnalise = statusAnalise;
        this.justificativa = justificativa;
    }

    public ItemFatura(
        int idItem,
        int idFatura,
        int idDespesa,
        float valorItem,
        LocalDate dataItem,
        String statusAnalise,
        String justificativa
    ) {
        this(
            idFatura,
            idDespesa,
            valorItem,
            dataItem,
            statusAnalise,
            justificativa
        );
        this.idItem = idItem;
    }

    // getters
    public int getIdItem() { return idItem; }
    public int getIdFatura() { return idFatura; }
    public int getIdDespesa() { return idDespesa; }
    public float getValorItem() { return valorItem; }
    public LocalDate getDataItem() { return dataItem; }
    public String getStatusAnalise() { return statusAnalise; }
    public String getJustificativa() { return justificativa; }

}