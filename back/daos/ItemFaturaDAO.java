package br.brisa.back.daos;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import br.brisa.back.modelos.ItemFatura;
import br.brisa.back.conexao.Bd;

public class ItemFaturaDAO {

    // CREATE
    public void criar(ItemFatura i) throws SQLException {
        String sql = """
            INSERT INTO item_fatura
            (id_fatura, id_despesa, valor_item, data_item,
            status_analise, justificativa)
            VALUES (?, ?, ?, ?, ?, ?)
        """;

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, i.getIdFatura());
            stmt.setInt(2, i.getIdDespesa());
            stmt.setFloat(3, i.getValorItem());
            stmt.setDate(4, Date.valueOf(i.getDataItem()));


            if (i.getStatusAnalise() != null)
                stmt.setString(5, i.getStatusAnalise());
            else
                stmt.setNull(5, Types.VARCHAR);

            if (i.getJustificativa() != null)
                stmt.setString(6, i.getJustificativa());
            else
                stmt.setNull(6, Types.VARCHAR);

            stmt.executeUpdate();
        }
    }

    // READ (listar todas)
    public List<ItemFatura> listar() throws SQLException {
        List<ItemFatura> lista = new ArrayList<>();

        //IMPORTANTE: dividir entre select ... where id_fatura ou id_despesa = X;
        String sql = "SELECT * FROM item_fatura";

        try (Connection conn = Bd.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                lista.add(new ItemFatura(
                    rs.getInt("id_item"),
                    rs.getInt("id_fatura"),
                    rs.getInt("id_despesa"),
                    rs.getFloat("valor_item"),
                    rs.getDate("data_item").toLocalDate(),
                    rs.getString("status_analise"),
                    rs.getString("justificativa")
                ));
            }
        }
        return lista;
    }

    // UPDATE
    public void atualizar(ItemFatura i) throws SQLException {
        String sql = """
            UPDATE item_fatura SET
                id_fatura = ?,
                id_despesa = ?,
                valor_item = ?,
                data_item = ?,
                status_analise = ?,
                justificativa = ?,
            WHERE id_item = ?
        """;

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, i.getIdFatura());
            stmt.setInt(2, i.getIdDespesa());
            stmt.setFloat(3, i.getValorItem());
            stmt.setDate(4, Date.valueOf(i.getDataItem()));


            if (i.getStatusAnalise() != null)
                stmt.setString(5, i.getStatusAnalise());
            else
                stmt.setNull(5, Types.VARCHAR);

            if (i.getJustificativa() != null)
                stmt.setString(6, i.getJustificativa());
            else
                stmt.setNull(6, Types.VARCHAR);

            stmt.executeUpdate();
        }
    }

    // DELETE
    public void deletar(int idItem) throws SQLException {
        String sql = "DELETE FROM item_fatura WHERE id_item = ?";

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, idItem);
            stmt.executeUpdate();
        }
    }
}
