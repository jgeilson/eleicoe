/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { parseTseOfficialJson, TseRawJson } from '../src/utils/tseParser.js';
import {
  getOrFetchElectionData,
  buildDocumentedTseUrl,
  OFFICIAL_ELECTION_CODE_T1_2026,
  OFFICIAL_ELECTION_CODE_T2_2026
} from '../src/services/electionService.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

// ---------------------------------------------------------
// FIXTURES REAIS NO PADRÃO OFICIAL 2026 (-u.json)
// ---------------------------------------------------------
const FIXTURE_TSE_2026_BR_U_JSON: TseRawJson = {
  ele: '6258',
  tpabr: 'BR',
  cdabr: 'BR',
  carag: '1',
  t: '2',
  f: 'o',
  dg: '25/10/2026',
  hg: '20:30:00',
  tf: 's',
  esae: 's',
  abr: [
    {
      cdabr: 'BR',
      dsabr: 'Brasil',
      s: '472078',
      st: '472078',
      pst: '100,00',
      ea: '161350000',
      c: '129550000',
      a: '31800000',
      vvc: '122850000',
      vb: '2580000',
      vn: '4120000',
      tf: 's',
      esae: 's',
      cand: [
        {
          seq: '1',
          sqcand: '280001234567',
          n: '13',
          nm: 'LUIZ INÁCIO LULA DA SILVA',
          nmp: 'LUIZ INÁCIO LULA DA SILVA',
          sgp: 'PT',
          vap: '62407800',
          pvap: '50,80',
          st: 'Eleito',
          e: 's'
        },
        {
          seq: '2',
          sqcand: '280007654321',
          n: '22',
          nm: 'FLÁVIO BOLSONARO',
          nmp: 'FLÁVIO NANTES BOLSONARO',
          sgp: 'PL',
          vap: '60442200',
          pvap: '49,20',
          st: 'Não eleito',
          e: 'n'
        }
      ]
    }
  ]
};

async function runTests() {
  console.log('======================================================');
  console.log('SUÍTE DETERMINÍSTICA DE TESTES DE INTEGRAÇÃO DO TSE 2026');
  console.log('======================================================\n');

  // 1. Teste de montagem de URL no padrão oficial documentado (-u.json)
  console.log('[Grupo 1] Montagem de URLs Documentadas pelo TSE:');
  const urlBrT2 = buildDocumentedTseUrl('BR', OFFICIAL_ELECTION_CODE_T2_2026);
  assert(
    urlBrT2 === 'https://resultados.tse.jus.br/oficial/ele2026/6258/dados/br/br-c0001-e006258-u.json',
    'URL de 2º Turno (BR) usa exatamente o sufixo -u.json e pasta /dados/br/'
  );
  const urlSpT1 = buildDocumentedTseUrl('SP', OFFICIAL_ELECTION_CODE_T1_2026);
  assert(
    urlSpT1 === 'https://resultados.tse.jus.br/oficial/ele2026/6257/dados/sp/sp-c0001-e006257-u.json',
    'URL de 1º Turno (SP) usa código 6257, sufixo -u.json e pasta /dados/sp/'
  );

  // 2. Teste com Fixture Real do TSE 2026
  console.log('\n[Grupo 2] Parser com Fixture Oficial 2026:');
  const resFixture = parseTseOfficialJson(FIXTURE_TSE_2026_BR_U_JSON, {
    expectedTurn: 2,
    expectedScope: 'BR',
    expectedElectionCode: '6258',
    sourceVerified: true,
    provenance: 'OFFICIAL_TSE_LIVE'
  });
  assert(resFixture.success === true, 'Parse com fixture real retornou success: true');
  assert(resFixture.data?.turno2.totalValidVotes === 122850000, 'Votos válidos extraídos com exatidão: 122.850.000');
  assert(resFixture.data?.turno2.status === 'ELEIÇÃO DEFINIDA', 'Status apurado corretamente como ELEIÇÃO DEFINIDA (esae: s e tf: s)');
  assert(resFixture.data?.turno2.nationalCandidates[0].votes === 62407800, 'Votos do candidato líder: 62.407.800');
  assert(resFixture.data?.turno2.nationalCandidates[0].number === 13, 'Número do candidato preservado como 13');
  assert(resFixture.data?.turno2.nationalCandidates[1].number === 22, 'Número do candidato preservado como 22');

  // 3. Teste de consistência matemática dos votos
  console.log('\n[Grupo 3] Consistência dos Votos e Percentuais:');
  const cands = resFixture.data?.turno2.nationalCandidates || [];
  const somaVotos = (cands[0].votes || 0) + (cands[1].votes || 0);
  assert(
    somaVotos === resFixture.data?.turno2.totalValidVotes,
    'Soma dos votos dos candidatos é 100% idêntica ao total de votos válidos'
  );
  const somaPcts = Math.round((cands[0].percentage || 0) + (cands[1].percentage || 0));
  assert(somaPcts === 100, 'Soma das porcentagens dos candidatos totaliza 100%');

  // 4. Teste de Preservação de Número de Candidato Nulo (Issue 6.2)
  console.log('\n[Grupo 4] Tratamento de Número de Candidato Ausente/Inválido:');
  const fixtureMissingNumber: TseRawJson = {
    ele: '6258',
    cdabr: 'BR',
    t: '2',
    cand: [{ nm: 'Candidato Sem Numero', vap: '500' }] // campo 'n' ausente
  };
  const resMissingNum = parseTseOfficialJson(fixtureMissingNumber, {
    expectedTurn: 2,
    expectedScope: 'BR',
    expectedElectionCode: '6258',
    sourceVerified: true,
    provenance: 'OFFICIAL_TSE_LIVE'
  });
  assert(
    resMissingNum.data?.turno2.nationalCandidates[0].number === null,
    'Número de candidato ausente permanece como null (NUNCA vira 0)'
  );

  // 5. Teste de Distinção de Status da Eleição (Issue 6.3)
  console.log('\n[Grupo 5] Distinção Rigorosa de Status:');
  const fixturePartial: TseRawJson = {
    ele: '6258',
    cdabr: 'BR',
    t: '2',
    pst: '45,50', // apuração parcial
    tf: 'n',
    esae: 'n',
    cand: [{ n: '10', nm: 'Candidato Parcial', vap: '1000', st: 'Eleito' }] // mesmo que venha 'Eleito' em parcial
  };
  const resPartial = parseTseOfficialJson(fixturePartial, {
    expectedTurn: 2,
    expectedScope: 'BR',
    expectedElectionCode: '6258',
    sourceVerified: true,
    provenance: 'OFFICIAL_TSE_LIVE'
  });
  assert(
    resPartial.data?.turno2.status === 'EM APURAÇÃO',
    'Status em apuração parcial (45,50%) é "EM APURAÇÃO" (não antecipa ELEIÇÃO DEFINIDA sem totalização/esae)'
  );

  // 6. Teste de Rejeição de Escopos Inválidos (Issue 7 / P1)
  console.log('\n[Grupo 6] Rejeição Estrita de Escopos Inválidos:');
  const resInvalidScope = await getOrFetchElectionData({ scope: 'INVALID_UF', turn: 2 });
  assert(resInvalidScope.success === false, 'Rejeitou escopo inválido com success: false');
  assert(resInvalidScope.requestSucceeded === false, 'requestSucceeded é false para escopo inválido');
  assert(resInvalidScope.fetchError?.includes('Abrangência inválida') === true, 'Mensagem clara de erro sobre abrangência inválida');

  // 7. Teste de Rejeição de Código de Eleição Incompatível (P0)
  console.log('\n[Grupo 7] Rejeição de Código de Eleição Incompatível:');
  const fixtureWrongEle: TseRawJson = {
    ele: '545', // Código antigo de 2022 em vez de 6258
    cdabr: 'BR',
    t: '2',
    cand: [{ n: '13', nm: 'Candidato', vap: '100' }]
  };
  const resWrongEle = parseTseOfficialJson(fixtureWrongEle, {
    expectedTurn: 2,
    expectedScope: 'BR',
    expectedElectionCode: '6258',
    sourceVerified: true,
    provenance: 'OFFICIAL_TSE_LIVE'
  });
  assert(resWrongEle.success === false, 'Rejeitou com success: false código antigo 545');
  assert(resWrongEle.errors?.some(e => e.includes('Código de eleição rejeitado')) === true, 'Erro de código de eleição rejeitado presente');

  // 8. Teste de Seleção Precisa de Abrangência dentro de abr[] (Issue 3 / P1)
  console.log('\n[Grupo 8] Seleção Precisa de Abrangência em Arquivo Consolidado:');
  const fixtureMultiAbr: TseRawJson = {
    ele: '6258',
    t: '2',
    abr: [
      { cdabr: 'BA', vvc: '8000000', cand: [{ n: '10', nm: 'Cand BA', vap: '8000000' }] },
      { cdabr: 'SP', vvc: '24000000', cand: [{ n: '20', nm: 'Cand SP', vap: '24000000' }] }
    ]
  };
  const resSelectSP = parseTseOfficialJson(fixtureMultiAbr, {
    expectedTurn: 2,
    expectedScope: 'SP',
    expectedElectionCode: '6258',
    sourceVerified: true,
    provenance: 'OFFICIAL_TSE_LIVE'
  });
  assert(resSelectSP.success === true, 'Localizou SP dentro de abr[]');
  assert(resSelectSP.data?.turno2.totalValidVotes === 24000000, 'Extraiu votos válidos de SP (24M e não 8M da Bahia)');

  console.log(`\n======================================================`);
  console.log(`RESULTADO DA SUÍTE: ${passed} passaram, ${failed} falharam.`);
  console.log(`======================================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
