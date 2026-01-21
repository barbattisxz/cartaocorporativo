package br.brisa.back.daos;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import br.brisa.back.modelos.Projeto;
import br.brisa.back.conexao.Bd;

public class ProjetoDAO {

    // CREATE
    public void criar(Projeto p) throws SQLException {
        String sql = """
            INSERT INTO projeto
            (sigla, nome, agencia_fomento,
            numero_processo, orcamento, data_inicio, data_final)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """;

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, p.getSigla());
            stmt.setString(2, p.getNome());

            if (p.getAgenciaFomento() != null)
                stmt.setString(3, p.getAgenciaFomento());
            else
                stmt.setNull(3, Types.VARCHAR);

            if (p.getNumeroProcesso() != null)
                stmt.setString(4, p.getNumeroProcesso());
            else
                stmt.setNull(4, Types.VARCHAR);

            stmt.setFloat(5, p.getOrcamento());
            
            if (p.getDataInicial() != null)
                stmt.setDate(6, Date.valueOf(p.getDataInicial()));
            else
                stmt.setNull(6, Types.DATE);
            
            if (p.getDataFinal() != null)
                stmt.setDate(7, Date.valueOf(p.getDataFinal()));
            else
                stmt.setNull(7, Types.DATE);

            stmt.executeUpdate();
        }
    }

    // READ (listar todas)
    public List<Projeto> listar() throws SQLException {
        List<Projeto> lista = new ArrayList<>();

        String sql = "SELECT * FROM projeto";

        try (Connection conn = Bd.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                lista.add(new Projeto(
                    rs.getInt("id_projeto"),
                    rs.getString("sigla"),
                    rs.getString("nome"),
                    rs.getString("agencia_fomento"),
                    rs.getString("numero_processo"),
                    rs.getFloat("orcamento"),
                    rs.getDate("data_inicio").toLocalDate(),
                    rs.getDate("data_final").toLocalDate()
                ));
            }
        }
        return lista;
    }

    // UPDATE
    public void atualizar(Projeto p) throws SQLException {
        String sql = """
            UPDATE projeto SET
                sigla = ?,
                nome = ?,
                agencia_fomento = ?,
                numero_processo = ?,
                orcamento = ?,
                data_inicio = ?,
                data_final = ?
            WHERE id_projeto = ?
        """;

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, p.getSigla());
            stmt.setString(2, p.getNome());

            if (p.getAgenciaFomento() != null)
                stmt.setString(3, p.getAgenciaFomento());
            else
                stmt.setNull(3, Types.VARCHAR);

            if (p.getNumeroProcesso() != null)
                stmt.setString(4, p.getNumeroProcesso());
            else
                stmt.setNull(4, Types.VARCHAR);

            stmt.setFloat(5, p.getOrcamento());
            stmt.setDate(6, Date.valueOf(p.getDataInicial()));
            stmt.setDate(7, Date.valueOf(p.getDataFinal()));

            stmt.executeUpdate();
        }
    }

    // DELETE
    public void deletar(int idProjeto) throws SQLException {
        String sql = "DELETE FROM projeto WHERE id_projeto = ?";

        try (Connection conn = Bd.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, idProjeto);
            stmt.executeUpdate();
        }
    }
}
