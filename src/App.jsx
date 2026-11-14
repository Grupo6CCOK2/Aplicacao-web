import { useState } from "react";
import { agendamentosIniciais } from "./data/agendamentos";
import { funcionariosIniciais } from "./data/funcionarios";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HomeSections from "./components/HomeSections";
import ServicesPage from "./components/ServicesPage";
import AuthPage from "./components/AuthPage";
import BookingPage from "./components/BookingPage";
import ContactPage from "./components/ContactPage";
import ClientDashboard from "./components/ClientDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import Footer from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [funcionarios, setFuncionarios] = useState(funcionariosIniciais);
  const [agendamentos, setAgendamentos] = useState(agendamentosIniciais);
  const adicionarAgendamento = (novo) =>
    setAgendamentos((atuais) => [novo, ...atuais]);
  const cancelarAgendamento = (id) =>
    setAgendamentos((atuais) => atuais.filter((item) => item.id !== id));
  const [paginaAtual, setPaginaAtual] = useState("inicio");
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [perfilCliente, setPerfilCliente] = useState({
    nome: "Sam",
    telefone: "(11) 98765-4321",
    email: "sam@email.com",
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  });
  const [dependentes, setDependentes] = useState([
    { id: 1, nome: "Lucas", parentesco: "Filho(a)" },
  ]);
  const [servicoPreSelecionado, setServicoPreSelecionado] =
    useState("Corte Masculino");

  const mudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finalizarLogin = (nomeUsuario) => {
    setUsuarioLogado(nomeUsuario);
    setPerfilCliente((perfil) => ({ ...perfil, nome: nomeUsuario }));
    mudarPagina("cliente");
  };

  const finalizarCadastro = (dados) => {
    setPerfilCliente(dados.perfil);
    setDependentes(dados.dependentes);
    setUsuarioLogado(dados.perfil.nome);
    mudarPagina("cliente");
  };

  const iniciarAgendamento = (nomeServico) => {
    if (typeof nomeServico === "string") {
      setServicoPreSelecionado(nomeServico);
    }
    mudarPagina("agendamento");
  };

  return (
    <div>
      <Navbar
        paginaAtual={paginaAtual}
        mudarPagina={mudarPagina}
        usuarioLogado={usuarioLogado}
        aoSair={() => {
          setUsuarioLogado(null);
          mudarPagina("inicio");
        }}
      />

      <main>
        {paginaAtual === "inicio" && (
          <>
            <Hero aoAgendar={iniciarAgendamento} />
            <HomeSections
              aoVerServicos={() => mudarPagina("servicos")}
              aoAgendar={iniciarAgendamento}
            />
            <ContactPage />
          </>
        )}

        {paginaAtual === "servicos" && (
          <ServicesPage aoAgendar={iniciarAgendamento} />
        )}

        {paginaAtual === "login" && (
          <AuthPage
            key="login"
            modoInicial="login"
            aoConcluirAuth={finalizarLogin}
            aoConcluirCadastro={finalizarCadastro}
          />
        )}

        {paginaAtual === "agendamento" && (
          <BookingPage
            key={servicoPreSelecionado}
            servicoInicial={servicoPreSelecionado}
            meusAgendamentos={agendamentos}
            aoAdicionarAgendamento={adicionarAgendamento}
            aoCancelarAgendamento={cancelarAgendamento}
          />
        )}

        {paginaAtual === "cliente" && (
          <ClientDashboard
            perfilCliente={perfilCliente}
            aoSalvarPerfil={(perfil) => {
              setPerfilCliente(perfil);
              if (usuarioLogado) setUsuarioLogado(perfil.nome);
            }}
            dependentes={dependentes}
            setDependentes={setDependentes}
            agendamentos={agendamentos}
            cancelarAgendamento={cancelarAgendamento}
            usuarioLogado={usuarioLogado}
            aoIrParaAgendamento={() => mudarPagina("agendamento")}
            aoSair={() => {
              setUsuarioLogado(null);
              mudarPagina("inicio");
            }}
          />
        )}

        {paginaAtual === "funcionario" && (
          <EmployeeDashboard
            funcionario={funcionarios[0] || null}
            funcionarios={funcionarios}
            aoSalvarPerfil={(perfil) =>
              setFuncionarios((atuais) =>
                atuais.map((item) => (item.id === perfil.id ? perfil : item)),
              )
            }
          />
        )}

        {paginaAtual === "admin" && (
          <AdminDashboard
            usuarioLogado={usuarioLogado}
            funcionarios={funcionarios}
            setFuncionarios={setFuncionarios}
          />
        )}
      </main>

      {paginaAtual !== "admin" && <Footer />}
    </div>
  );
}
