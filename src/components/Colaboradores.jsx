import { useState } from 'react'
import { api } from '../api'

export default function Colaboradores() {
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [func, setFunc] = useState('')

  const handleCpfChange = (e) => {
    let v = e.target.value.replace(/\D/g, '')
    if (v.length <= 11) {
      v = v.replace(/(\d{3})(\d)/, '$1.$2')
      v = v.replace(/(\d{3})(\d)/, '$1.$2')
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      setCpf(v)
    }
  }

  async function adicionar() {
    if (!nome.trim()) { alert('Informe o nome.'); return }
    try {
      await api.post('/colaboradores', { 
        nome: nome.trim(), 
        mat: cpf.trim(), /* saved in DB inside 'mat' column */
        func: func.trim() 
      })
      alert('Colaborador cadastrado com sucesso')
      setNome(''); setCpf(''); setFunc('')
    } catch (error) {
      alert('Erro ao salvar colaborador')
    }
  }

  return (
    <div>
      <div className="card">
        <div className="card-title">Cadastrar Colaborador</div>
        <div className="form-row">
          <div className="form-col">
            <label className="form-label">Nome completo</label>
            <input type="text" placeholder="Ex: João Silva" value={nome} onChange={e => setNome(e.target.value)} />
          </div>
          <div className="form-col">
            <label className="form-label">CPF</label>
            <input type="text" placeholder="000.000.000-00" value={cpf} onChange={handleCpfChange} />
          </div>
          <div className="form-col">
            <label className="form-label">Função</label>
            <input type="text" placeholder="Ex: Técnico" value={func} onChange={e => setFunc(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={adicionar}>+ Cadastrar</button>
      </div>
    </div>
  )
}
