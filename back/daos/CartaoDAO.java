package br.brisa.back.daos;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import br.brisa.back.modelos.Cartao;
import br.brisa.back.conexao.Bd;

public class CartaoDAO {

    // CREATE
    public void criar(Cartao c) throws SQLException {
        String sql = """
            INSERT INTO cartao
            (numero_cc, vencimento_cartao, vencimento_fatura, id_beneficiario)
            VALUES (?, ?, ?, ?)
        """;

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, c.getNumeroCC());
            stmt.setDate(2, Date.valueOf(c.getVencimentoCartao()));
            stmt.setDate(3, Date.valueOf(c.getVencimentoFatura()));
            stmt.setInt(4, c.getIdBeneficiario());

            stmt.executeUpdate();
        }
    }

    // READ (listar todas)
    public List<Cartao> listar() throws SQLException {
        List<Cartao> lista = new ArrayList<>();

        String sql = "SELECT * FROM cartao";

        try (Connection conn = Bd.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                lista.add(new Cartao(
                    rs.getInt("id_cartao"),
                    rs.getString("numero_cc"),
                    rs.getDate("vencimento_cartao").toLocalDate(),
                    rs.getDate("vencimento_fatura").toLocalDate(),
                    rs.getInt("id_beneficiario")
                ));
            }
        }
        return lista;
    }

    // UPDATE
    public void atualizar(Cartao c) throws SQLException {
        String sql = """
            UPDATE cartao SET
                numero_cc = ?,
                vencimento_cartao = ?,
                vencimento_fatura = ?,
                id_beneficiario = ?
            WHERE id_cartao = ?
        """;

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, c.getNumeroCC());
            stmt.setDate(2, Date.valueOf(c.getVencimentoCartao()));
            stmt.setDate(3, Date.valueOf(c.getVencimentoFatura()));
            stmt.setInt(4, c.getIdBeneficiario());

            stmt.executeUpdate();
        }
    }

    // DELETE
    public void deletar(int idCartao) throws SQLException {
        String sql = "DELETE FROM cartao WHERE id_cartao = ?";

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, idCartao);
            stmt.executeUpdate();
        }
    }
}
