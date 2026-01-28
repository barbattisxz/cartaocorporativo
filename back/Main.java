package br.brisa.back;

import java.time.LocalDate;
import java.util.List;

import br.brisa.back.daos.*;
import br.brisa.back.modelos.*;

public class Main {

    public static void main(String[] args) {
        //FUNCIONANDO:
        DespesaDAO Ddao = new DespesaDAO();
        ProjetoDAO Pdao = new ProjetoDAO();
        CartaoDAO Cdao = new CartaoDAO();
        VerificadorDAO Vdao = new VerificadorDAO();
        BeneficiarioDAO Bdao = new BeneficiarioDAO();

        //A TESTAR:
        FaturaDAO Fdao = new FaturaDAO();
        ItemFaturaDAO Ifdao= new ItemFaturaDAO();

        try {
            //CREATE
            //______

            //FUNCIONANDO:

            Despesa d = new Despesa(
                1,          // id_tipo_despesa
                2,          // id_beneficiario
                2,       // id_projeto
                LocalDate.now(),
                56.47f,
                "12345000159",
                null         // imagem_nota
            );

            Projeto p = new Projeto(
                3000.85f,
                "RJb",
                "Rio de Janeiro - Botafogo",
                "PUC Rio",
                "447-29",
                LocalDate.now(),
                null
            );

            Beneficiario b = new Beneficiario(
                "Maven de Maven Terceiro",
                "Maven3",
                "mavenfuncional3@gmail.com"
            );

            Cartao c = new Cartao(
                "1111111111111111",
                LocalDate.parse("2026-12-29"), //Texto para data é sempre AAAA-MM-DD
                LocalDate.now(),
                2
            );

            Verificador v = new Verificador(
                "Ciclano coisa e Tal",
                "Verificador de marketing",
                "ciclanotal@gmail.com"
            );

            Ddao.criar(d);
            //Pdao.criar(p);
            Bdao.criar(b);
            //Cdao.criar(c);
            //Vdao.criar(v);
           

            Fatura f = new Fatura(
                2,
                1234.00f,
                LocalDate.now(),
                1
            );

            Fdao.criar(f);

            ItemFatura i = new ItemFatura(
                2,
                2,
                5.99f,
                LocalDate.now(),
                "Permitido",
                "Gastos com hotel.");

            Ifdao.criar(i);

            //READ
            //____

            //FUNCIONANDO:

            /* List<Despesa> despesas = Ddao.listar();
            despesas.forEach(dep ->
                System.out.println(
                    dep.getIdDespesa() + " - " + dep.getValor()
                )
            );

            List<Projeto> projetos = Pdao.listar();
            projetos.forEach(dep ->
                System.out.println(
                    dep.getIdProjeto() + " - " + dep.getNome()
                )
            );

            List<Beneficiario> beneficiarios = Bdao.listar();
            beneficiarios.forEach(dep ->
                System.out.println(
                    dep.getIdBeneficiario() + " - " + dep.getNome()
                )
            ); 
            
            List<Cartao> cartoes = Cdao.listar();
            cartoes.forEach(dep ->
                System.out.println(
                    dep.getIdBeneficiario() + " - " + dep.getNumeroCC()
                )
            );
            
            List<Verificador> verificadores = Vdao.listar();
            verificadores.forEach(dep ->
                System.out.println(
                    dep.getIdVerificador() + " - " + dep.getNome()
                )
            ); 

            */

            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
