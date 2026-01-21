package br.brisa.back.modelos;

public class Verificador{
    private int idVerificador;
    private String nome, cargo, email;

    public Verificador(
        String nome,
        String cargo,
        String email
    ) {
        this.nome = nome;
        this.cargo = cargo;
        this.email = email;
    }

    public Verificador(
        int idVerificador,
        String nome,
        String cargo,
        String email
    ) {
        this(
            nome,
            cargo,
            email
        );
        this.idVerificador = idVerificador;
    }

    // getters
    public int getIdVerificador() { return idVerificador; }
    public String getNome() { return nome; }
    public String getCargo() { return cargo; }
    public String getEmail() { return email; }
}