package br.brisa.back.daos;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import br.brisa.back.modelos.Verificador;
import br.brisa.back.conexao.Bd;

public class VerificadorDAO {

    // CREATE
    public void criar(Verificador v) throws SQLException {
        String sql = """
            INSERT INTO verificador
            (nome, cargo, email)
            VALUES (?, ?, ?)
        """;

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, v.getNome());

            if (v.getCargo() != null)
                stmt.setString(2, v.getCargo());
            else
                stmt.setNull(2, Types.VARCHAR);

            if (v.getEmail() != null)
                stmt.setString(3, v.getEmail());
            else
                stmt.setNull(3, Types.VARCHAR);

            stmt.executeUpdate();
        }
    }

    // READ (listar todas)
    public List<Verificador> listar() throws SQLException {
        List<Verificador> lista = new ArrayList<>();

        String sql = "SELECT * FROM verificador";

        try (Connection conn = Bd.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                lista.add(new Verificador(
                    rs.getInt("id_verificador"),
                    rs.getString("nome"),
                    rs.getString("cargo"),
                    rs.getString("email")
                ));
            }
        }
        return lista;
    }

    // UPDATE
    public void atualizar(Verificador v) throws SQLException {
        String sql = """
            UPDATE verificador SET
                nome = ?,
                cargo = ?,
                email = ?
            WHERE id_verificador = ?
        """;

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, v.getNome());

            if (v.getCargo() != null)
                stmt.setString(2, v.getCargo());
            else
                stmt.setNull(2, Types.VARCHAR);

            if (v.getEmail() != null)
                stmt.setString(3, v.getEmail());
            else
                stmt.setNull(3, Types.VARCHAR);

            stmt.executeUpdate();
        }
    }

    // DELETE
    public void deletar(int idVerificador) throws SQLException {
        String sql = "DELETE FROM verificador WHERE id_verificador = ?";

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, idVerificador);
            stmt.executeUpdate();
        }
    }
}
