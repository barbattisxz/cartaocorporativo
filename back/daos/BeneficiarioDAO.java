package br.brisa.back.daos;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import br.brisa.back.modelos.Beneficiario;
import br.brisa.back.conexao.Bd;

public class BeneficiarioDAO {

    // CREATE
    public void criar(Beneficiario b) throws SQLException {
        String sql = """
            INSERT INTO beneficiario
            (nome, funcao, email)
            VALUES (?, ?, ?)
        """;

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            if (b.getNome() != null)
                stmt.setString(1, b.getNome());
            else
                stmt.setNull(1, Types.VARCHAR);

            stmt.setString(2, b.getFuncao());
            stmt.setString(3, b.getEmail());

            stmt.executeUpdate();
        }
    }

    // READ (listar todas)
    public List<Beneficiario> listar() throws SQLException {
        List<Beneficiario> lista = new ArrayList<>();

        String sql = "SELECT * FROM beneficiario";

        try (Connection conn = Bd.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                lista.add(new Beneficiario(
                    rs.getInt("id_beneficiario"),
                    rs.getString("nome"),
                    rs.getString("funcao"),
                    rs.getString("email")
                ));
            }
        }
        return lista;
    }

    // UPDATE
    public void atualizar(Beneficiario b) throws SQLException {
        String sql = """
            UPDATE beneficario SET
                nome = ?,
                funcao = ?,
                email = ?
            WHERE id_beneficiario = ?
        """;

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            if (b.getNome() != null)
                stmt.setString(1, b.getNome());
            else
                stmt.setNull(1, Types.VARCHAR);

            stmt.setString(2, b.getFuncao());
            stmt.setString(3, b.getEmail());

            stmt.executeUpdate();
        }
    }

    // DELETE
    public void deletar(int idBeneficiario) throws SQLException {
        String sql = "DELETE FROM beneficiario WHERE id_beneficiario = ?";

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, idBeneficiario);
            stmt.executeUpdate();
        }
    }
}
