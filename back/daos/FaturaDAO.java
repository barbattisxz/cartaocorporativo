package br.brisa.back.daos;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import br.brisa.back.modelos.Fatura;
import br.brisa.back.conexao.Bd;

public class FaturaDAO {

    // CREATE
    public void criar(Fatura f) throws SQLException {
        String sql = """
            INSERT INTO fatura
            (id_cartao, valor_fatura, data_fatura, id_verificador)
            VALUES (?, ?, ?, ?)
        """;

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, f.getIdCartao());
            stmt.setFloat(2, f.getValorFatura());
            stmt.setDate(3, Date.valueOf(f.getDataFatura()));
            stmt.setInt(4, f.getIdVerificador());

            stmt.executeUpdate();
        }
    }

    // READ (listar todas)
    public List<Fatura> listar() throws SQLException {
        List<Fatura> lista = new ArrayList<>();

        String sql = "SELECT * FROM fatura";

        try (Connection conn = Bd.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                lista.add(new Fatura(
                    rs.getInt("id_fatura"),
                    rs.getInt("id_cartao"),
                    rs.getFloat("valor_fatura"),
                    rs.getDate("data_fatura").toLocalDate(),
                    rs.getInt("id_verificador")
                ));
            }
        }
        return lista;
    }

    // UPDATE
    public void atualizar(Fatura f) throws SQLException {
        String sql = """
            UPDATE fatura SET
                id_cartao = ?,
                valor_fatura = ?,
                data_fatura = ?,
                id_verificador = ?
            WHERE id_fatura = ?
        """;

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, f.getIdCartao());
            stmt.setFloat(2, f.getValorFatura());
            stmt.setDate(3, Date.valueOf(f.getDataFatura()));
            stmt.setInt(4, f.getIdVerificador());

            stmt.executeUpdate();
        }
    }

    // DELETE
    public void deletar(int idFatura) throws SQLException {
        String sql = "DELETE FROM fatura WHERE id_fatura = ?";

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, idFatura);
            stmt.executeUpdate();
        }
    }
}
