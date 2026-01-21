package br.brisa.back.modelos;

public class Beneficiario{
    private int idBeneficiario;
    private String nome, funcao, email;

    public Beneficiario(
        String nome,
        String funcao,
        String email
    ) {
        this.nome = nome;
        this.funcao = funcao;
        this.email = email;
    }

    public Beneficiario(
        int idBenficiario,
        String nome,
        String funcao,
        String email
    ) {
        this(
            nome,
            funcao,
            email
        );
        this.idBeneficiario = idBeneficiario;
    }

    // getters
    public int getIdBeneficiario() { return idBeneficiario; }
    public String getNome() { return nome; }
    public String getFuncao() { return funcao; }
    public String getEmail() { return email; }
}