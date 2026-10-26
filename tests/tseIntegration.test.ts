/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { parseTseOfficialJson, TseRawJson } from '../src/utils/tseParser.js';
import { getOrFetchElectionData } from '../src/services/electionService.js';

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

async function runTests() {
  console.log('--- INICIANDO TESTES DE INTEGRAÇÃO DO TSE 2026 ---');

  // Test 1: Rejection of Incompatible Election Code (Issue 2)
  console.log('\n[Teste 1] Rejeição de código de eleição incompatível:');
  const invalidElePayload: TseRawJson = {
    ele: '9999',
    cdabr: 'BR',
    t: '2',
    cand: [{ n: '13', nm: 'Candidato A', vap: '1000' }]
  };
  const res1 = parseTseOfficialJson(invalidElePayload, {
    expectedTurn: 2,
    expectedScope: 'BR',
    expectedElectionCode: '6258',
    sourceVerified: true,
    provenance: 'OFFICIAL_TSE_LIVE'
  });
  assert(res1.success === false, 'Rejeitou com success: false');
  assert(res1.errors?.some(e => e.includes('Código de eleição rejeitado')) === true, 'Mensagem específica de erro de código de eleição');

  // Test 2: Rejection of Scope Mismatch (Issue 3 & 8)
  console.log('\n[Teste 2] Rejeição de escopo divergente (pediu BR, veio PB):');
  const mismatchScopePayload: TseRawJson = {
    ele: '6258',
    cdabr: 'PB',
    t: '2',
    cand: [{ n: '13', nm: 'Candidato A', vap: '1000' }]
  };
  const res2 = parseTseOfficialJson(mismatchScopePayload, {
    expectedTurn: 2,
    expectedScope: 'BR',
    expectedElectionCode: '6258',
    sourceVerified: true,
    provenance: 'OFFICIAL_TSE_LIVE'
  });
  assert(res2.success === false, 'Rejeitou com success: false quando escopo diverge');
  assert(res2.errors?.some(e => e.includes('Abrangência divergente')) === true, 'Mensagem de abrangência divergente presente');

  // Test 3: Correct Extraction of Nested Scope from abr[] array (Issue 3)
  console.log('\n[Teste 3] Extração precisa de abrangência específica dentro de abr[]:');
  const multiAbrPayload: TseRawJson = {
    ele: '6258',
    t: '2',
    abr: [
      {
        cdabr: 'SP',
        vvc: '500000',
        cand: [{ n: '10', nm: 'Cand SP', vap: '500000' }]
      },
      {
        cdabr: 'BR',
        vvc: '120000000',
        cand: [
          { n: '13', nm: 'Lula', vap: '62000000', pvap: '51,67', st: 'Eleito', e: 's' },
          { n: '22', nm: 'Flávio', vap: '58000000', pvap: '48,33', st: 'Não eleito', e: 'n' }
        ]
      }
    ]
  };
  const res3 = parseTseOfficialJson(multiAbrPayload, {
    expectedTurn: 2,
    expectedScope: 'BR',
    expectedElectionCode: '6258',
    sourceVerified: true,
    provenance: 'OFFICIAL_TSE_LIVE'
  });
  assert(res3.success === true, 'Processou com sucesso ao encontrar BR dentro de abr[]');
  assert(res3.data?.turno2.totalValidVotes === 120000000, 'Extraiu métrica correta de BR (120M e não 500k de SP)');
  assert(res3.data?.turno2.nationalCandidates[0].name === 'Lula', 'Identificou candidato de BR e não de SP');

  // Test 4: Rejection of Turn Mismatch
  console.log('\n[Teste 4] Rejeição de turno incompatível (esperado 2, veio 1):');
  const turnMismatchPayload: TseRawJson = {
    ele: '6258',
    cdabr: 'BR',
    t: '1',
    cand: [{ n: '13', nm: 'Candidato A', vap: '1000' }]
  };
  const res4 = parseTseOfficialJson(turnMismatchPayload, {
    expectedTurn: 2,
    expectedScope: 'BR',
    expectedElectionCode: '6258',
    sourceVerified: true,
    provenance: 'OFFICIAL_TSE_LIVE'
  });
  assert(res4.success === false, 'Rejeitou arquivo com turno incompatível');

  // Test 5: Scoped Cache Isolation (Issue 4 - Never share cross-scope cache)
  console.log('\n[Teste 5] Isolamento de cache entre escopos distintos (BR vs SP):');
  const resScopeBR = await getOrFetchElectionData({ scope: 'BR', turn: 2 });
  const resScopeSP = await getOrFetchElectionData({ scope: 'SP', turn: 2 });
  assert(resScopeBR.scope === 'BR', 'Resposta para BR tem scope BR');
  assert(resScopeSP.scope === 'SP', 'Resposta para SP tem scope SP');
  assert(resScopeBR.presidentialData?.audit.codigoAbrangencia === 'BR', 'Audit de BR é BR');
  assert(resScopeSP.presidentialData?.audit.codigoAbrangencia === 'SP', 'Audit de SP é SP (nunca misturado)');

  // Test 6: Explicit API contract fields (Issue 5)
  console.log('\n[Teste 6] Contrato de API com separação de requestSucceeded, dataAvailable e dataIsOfficial:');
  assert(typeof resScopeBR.requestSucceeded === 'boolean', 'Campo requestSucceeded é booleano');
  assert(typeof resScopeBR.dataAvailable === 'boolean', 'Campo dataAvailable é booleano');
  assert(typeof resScopeBR.dataIsOfficial === 'boolean', 'Campo dataIsOfficial é booleano');

  console.log(`\n===========================================`);
  console.log(`RESULTADO DOS TESTES: ${passed} passaram, ${failed} falharam.`);
  console.log(`===========================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
