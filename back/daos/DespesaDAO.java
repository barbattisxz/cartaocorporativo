package br.brisa.back.daos;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import br.brisa.back.modelos.Despesa;
import br.brisa.back.conexao.Bd;

public class DespesaDAO {

    // CREATE
    public void criar(Despesa d) throws SQLException {
        String sql = """
            INSERT INTO despesa
            (id_tipo_despesa, id_beneficiario, id_projeto,
             data_despesa, valor, cnpj_fornecedor, imagem_nota)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """;

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, d.getIdTipoDespesa());
            stmt.setInt(2, d.getIdBeneficiario());

            if (d.getIdProjeto() != null)
                stmt.setInt(3, d.getIdProjeto());
            else
                stmt.setNull(3, Types.INTEGER);

            stmt.setDate(4, Date.valueOf(d.getDataDespesa()));
            stmt.setFloat(5, d.getValor());
            stmt.setString(6, d.getCnpjFornecedor());
            stmt.setBytes(7, d.getImagemNota());

            stmt.executeUpdate();
        }
    }

    // READ (listar todas)
    public List<Despesa> listar() throws SQLException {
        List<Despesa> lista = new ArrayList<>();

        String sql = "SELECT * FROM despesa";

        try (Connection conn = Bd.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                lista.add(new Despesa(
                    rs.getInt("id_despesa"),
                    rs.getInt("id_tipo_despesa"),
                    rs.getInt("id_beneficiario"),
                    rs.getObject("id_projeto", Integer.class),
                    rs.getDate("data_despesa").toLocalDate(),
                    rs.getFloat("valor"),
                    rs.getString("cnpj_fornecedor"),
                    rs.getBytes("imagem_nota")
                ));
            }
        }
        return lista;
    }

    // UPDATE
    public void atualizar(Despesa d) throws SQLException {
        String sql = """
            UPDATE despesa SET
                id_tipo_despesa = ?,
                id_beneficiario = ?,
                id_projeto = ?,
                data_despesa = ?,
                valor = ?,
                cnpj_fornecedor = ?,
                imagem_nota = ?
            WHERE id_despesa = ?
        """;

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, d.getIdTipoDespesa());
            stmt.setInt(2, d.getIdBeneficiario());

            if (d.getIdProjeto() != null)
                stmt.setInt(3, d.getIdProjeto());
            else
                stmt.setNull(3, Types.INTEGER);

            stmt.setDate(4, Date.valueOf(d.getDataDespesa()));
            stmt.setFloat(5, d.getValor());
            stmt.setString(6, d.getCnpjFornecedor());
            stmt.setBytes(7, d.getImagemNota());
            stmt.setInt(8, d.getIdDespesa());

            stmt.executeUpdate();
        }
    }

    // DELETE
    public void deletar(int idDespesa) throws SQLException {
        String sql = "DELETE FROM despesa WHERE id_despesa = ?";

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, idDespesa);
            stmt.executeUpdate();
        }
    }
}
