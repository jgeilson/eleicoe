import { ElectionData } from '../types/election';

export const initialElectionData: ElectionData = {
  "sourceUrl": "https://www.tse.jus.br",
  "articleTitle": "Painel Eleitoral 2026: Votação no Exterior (1º Turno x 2º Turno)",
  "publishedAt": "25/10/2026 - Apuração em tempo real",
  "updatedAt": new Date().toISOString(),
  "headline": "Acompanhamento estatístico dos boletins de urna oficiais afixados nas seções eleitorais do exterior.",
  "tseDisclaimer": "Os votos de cada turno são independentes e NÃO se somam. Apuração oficial centralizada no TSE.",
  "candidates": {
    "lula": {
      "name": "Luiz Inácio Lula da Silva",
      "shortName": "Lula",
      "party": "PT",
      "number": 13,
      "color": "#DC2626"
    },
    "bolsonaro": {
      "name": "Flávio Bolsonaro",
      "shortName": "Flávio Bolsonaro",
      "party": "PL",
      "number": 22,
      "color": "#2563EB"
    }
  },
  "countries": [
    {
      "id": "austr-lia",
      "country": "Austrália",
      "code": "AU",
      "continent": "Oceania",
      "flag": "🇦🇺",
      "locais": [
        "Austrália"
      ],
      "observacoes": "2º turno apurado: Lula 6017 x Flávio 3465",
      "turno1": {
        "disponivel": true,
        "votosLula": 4562,
        "votosBolsonaro": 2579,
        "votosBrancosNulos": 0,
        "totalValidos": 7141,
        "pctLula": 63.88460999859964,
        "pctBolsonaro": 36.115390001400364,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": true,
        "votosLula": 6017,
        "votosBolsonaro": 3465,
        "votosBrancosNulos": 0,
        "totalValidos": 9482,
        "pctLula": 63.46,
        "pctBolsonaro": 36.54,
        "winner": "Lula",
        "status": "Encerrada"
      }
    },
    {
      "id": "nova-zel-ndia",
      "country": "Nova Zelândia",
      "code": "NO",
      "continent": "Oceania",
      "flag": "🇳🇿",
      "locais": [
        "Nova Zelândia"
      ],
      "observacoes": "2º turno apurado: Lula 418 x Flávio 101",
      "turno1": {
        "disponivel": true,
        "votosLula": 234,
        "votosBolsonaro": 64,
        "votosBrancosNulos": 0,
        "totalValidos": 298,
        "pctLula": 78.52348993288591,
        "pctBolsonaro": 21.476510067114095,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": true,
        "votosLula": 418,
        "votosBolsonaro": 101,
        "votosBrancosNulos": 0,
        "totalValidos": 519,
        "pctLula": 80.54,
        "pctBolsonaro": 19.46,
        "winner": "Lula",
        "status": "Encerrada"
      }
    },
    {
      "id": "ar-bia-saudita",
      "country": "Arábia Saudita",
      "code": "AR",
      "continent": "Ásia",
      "flag": "🌐",
      "locais": [
        "Arábia Saudita"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 52,
        "votosBolsonaro": 22,
        "votosBrancosNulos": 0,
        "totalValidos": 74,
        "pctLula": 70.27027027027027,
        "pctBolsonaro": 29.72972972972973,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "bahrein",
      "country": "Bahrein",
      "code": "BA",
      "continent": "Ásia",
      "flag": "🌐",
      "locais": [
        "Bahrein"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 17,
        "votosBolsonaro": 27,
        "votosBrancosNulos": 0,
        "totalValidos": 44,
        "pctLula": 38.63636363636363,
        "pctBolsonaro": 61.36363636363637,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "catar",
      "country": "Catar",
      "code": "CA",
      "continent": "Ásia",
      "flag": "🌐",
      "locais": [
        "Catar"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 147,
        "votosBolsonaro": 173,
        "votosBrancosNulos": 0,
        "totalValidos": 320,
        "pctLula": 45.9375,
        "pctBolsonaro": 54.0625,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "china",
      "country": "China",
      "code": "CH",
      "continent": "Ásia",
      "flag": "🇨🇳",
      "locais": [
        "China"
      ],
      "observacoes": "2º turno apurado: Lula 502 x Flávio 267",
      "turno1": {
        "disponivel": true,
        "votosLula": 367,
        "votosBolsonaro": 203,
        "votosBrancosNulos": 0,
        "totalValidos": 570,
        "pctLula": 64.3859649122807,
        "pctBolsonaro": 35.6140350877193,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": true,
        "votosLula": 502,
        "votosBolsonaro": 267,
        "votosBrancosNulos": 0,
        "totalValidos": 769,
        "pctLula": 65.28,
        "pctBolsonaro": 34.72,
        "winner": "Lula",
        "status": "Encerrada"
      }
    },
    {
      "id": "chipre",
      "country": "Chipre",
      "code": "CH",
      "continent": "Ásia",
      "flag": "🌐",
      "locais": [
        "Chipre"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 24,
        "votosBolsonaro": 20,
        "votosBrancosNulos": 0,
        "totalValidos": 44,
        "pctLula": 54.54545454545454,
        "pctBolsonaro": 45.45454545454545,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "coreia-do-sul",
      "country": "Coreia do Sul",
      "code": "CO",
      "continent": "Ásia",
      "flag": "🇰🇷",
      "locais": [
        "Coreia do Sul"
      ],
      "observacoes": "2º turno apurado: Lula 148 x Flávio 82",
      "turno1": {
        "disponivel": true,
        "votosLula": 123,
        "votosBolsonaro": 72,
        "votosBrancosNulos": 0,
        "totalValidos": 195,
        "pctLula": 63.07692307692307,
        "pctBolsonaro": 36.92307692307693,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": true,
        "votosLula": 148,
        "votosBolsonaro": 82,
        "votosBrancosNulos": 0,
        "totalValidos": 230,
        "pctLula": 64.35,
        "pctBolsonaro": 35.65,
        "winner": "Lula",
        "status": "Encerrada"
      }
    },
    {
      "id": "emirados--rabes",
      "country": "Emirados Árabes",
      "code": "EM",
      "continent": "Ásia",
      "flag": "🇦🇪",
      "locais": [
        "Emirados Árabes"
      ],
      "observacoes": "2º turno apurado: Lula 643 x Flávio 772",
      "turno1": {
        "disponivel": true,
        "votosLula": 512,
        "votosBolsonaro": 659,
        "votosBrancosNulos": 0,
        "totalValidos": 1171,
        "pctLula": 43.72331340734415,
        "pctBolsonaro": 56.27668659265584,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": true,
        "votosLula": 643,
        "votosBolsonaro": 772,
        "votosBrancosNulos": 0,
        "totalValidos": 1415,
        "pctLula": 45.44,
        "pctBolsonaro": 54.56,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      }
    },
    {
      "id": "filipinas",
      "country": "Filipinas",
      "code": "FI",
      "continent": "Ásia",
      "flag": "🇵🇭",
      "locais": [
        "Filipinas"
      ],
      "observacoes": "2º turno apurado: Lula 27 x Flávio 39",
      "turno1": {
        "disponivel": true,
        "votosLula": 26,
        "votosBolsonaro": 33,
        "votosBrancosNulos": 0,
        "totalValidos": 59,
        "pctLula": 44.06779661016949,
        "pctBolsonaro": 55.932203389830505,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": true,
        "votosLula": 27,
        "votosBolsonaro": 39,
        "votosBrancosNulos": 0,
        "totalValidos": 66,
        "pctLula": 40.91,
        "pctBolsonaro": 59.09,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      }
    },
    {
      "id": "-ndia",
      "country": "Índia",
      "code": "ÍN",
      "continent": "Ásia",
      "flag": "🌐",
      "locais": [
        "Índia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 29,
        "votosBolsonaro": 27,
        "votosBrancosNulos": 0,
        "totalValidos": 56,
        "pctLula": 51.78571428571429,
        "pctBolsonaro": 48.214285714285715,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "indon-sia",
      "country": "Indonésia",
      "code": "IN",
      "continent": "Ásia",
      "flag": "🇮🇩",
      "locais": [
        "Indonésia"
      ],
      "observacoes": "2º turno apurado: Lula 15 x Flávio 23",
      "turno1": {
        "disponivel": true,
        "votosLula": 8,
        "votosBolsonaro": 19,
        "votosBrancosNulos": 0,
        "totalValidos": 27,
        "pctLula": 29.629629629629626,
        "pctBolsonaro": 70.37037037037037,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": true,
        "votosLula": 15,
        "votosBolsonaro": 23,
        "votosBrancosNulos": 0,
        "totalValidos": 38,
        "pctLula": 39.47,
        "pctBolsonaro": 60.53,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      }
    },
    {
      "id": "ir-",
      "country": "Irã",
      "code": "IR",
      "continent": "Ásia",
      "flag": "🌐",
      "locais": [
        "Irã"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 14,
        "votosBolsonaro": 11,
        "votosBrancosNulos": 0,
        "totalValidos": 25,
        "pctLula": 56.00000000000001,
        "pctBolsonaro": 44,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "israel",
      "country": "Israel",
      "code": "IS",
      "continent": "Ásia",
      "flag": "🌐",
      "locais": [
        "Israel"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 92,
        "votosBolsonaro": 523,
        "votosBrancosNulos": 0,
        "totalValidos": 615,
        "pctLula": 14.959349593495935,
        "pctBolsonaro": 85.04065040650407,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "jap-o",
      "country": "Japão",
      "code": "JA",
      "continent": "Ásia",
      "flag": "🇯🇵",
      "locais": [
        "Japão"
      ],
      "observacoes": "2º turno apurado: Lula 7098 x Flávio 28538",
      "turno1": {
        "disponivel": true,
        "votosLula": 5234,
        "votosBolsonaro": 24601,
        "votosBrancosNulos": 0,
        "totalValidos": 29835,
        "pctLula": 17.54315401374225,
        "pctBolsonaro": 82.45684598625775,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": true,
        "votosLula": 7098,
        "votosBolsonaro": 28538,
        "votosBrancosNulos": 0,
        "totalValidos": 35636,
        "pctLula": 19.92,
        "pctBolsonaro": 80.08,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      }
    },
    {
      "id": "jord-nia",
      "country": "Jordânia",
      "code": "JO",
      "continent": "Ásia",
      "flag": "🌐",
      "locais": [
        "Jordânia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 675,
        "votosBolsonaro": 59,
        "votosBrancosNulos": 0,
        "totalValidos": 734,
        "pctLula": 91.96185286103542,
        "pctBolsonaro": 8.038147138964577,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "kuwait",
      "country": "Kuwait",
      "code": "KU",
      "continent": "Ásia",
      "flag": "🇰🇼",
      "locais": [
        "Kuwait"
      ],
      "observacoes": "2º turno apurado: Lula 62 x Flávio 17",
      "turno1": {
        "disponivel": true,
        "votosLula": 54,
        "votosBolsonaro": 12,
        "votosBrancosNulos": 0,
        "totalValidos": 66,
        "pctLula": 81.81818181818183,
        "pctBolsonaro": 18.181818181818183,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": true,
        "votosLula": 62,
        "votosBolsonaro": 17,
        "votosBrancosNulos": 0,
        "totalValidos": 79,
        "pctLula": 78.48,
        "pctBolsonaro": 21.52,
        "winner": "Lula",
        "status": "Encerrada"
      }
    },
    {
      "id": "l-bano",
      "country": "Líbano",
      "code": "LÍ",
      "continent": "Ásia",
      "flag": "🌐",
      "locais": [
        "Líbano"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 2538,
        "votosBolsonaro": 1138,
        "votosBrancosNulos": 0,
        "totalValidos": 3676,
        "pctLula": 69.0424374319913,
        "pctBolsonaro": 30.957562568008708,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "mal-sia",
      "country": "Malásia",
      "code": "MA",
      "continent": "Ásia",
      "flag": "🇲🇾",
      "locais": [
        "Malásia"
      ],
      "observacoes": "2º turno apurado: Lula 41 x Flávio 44",
      "turno1": {
        "disponivel": true,
        "votosLula": 44,
        "votosBolsonaro": 27,
        "votosBrancosNulos": 0,
        "totalValidos": 71,
        "pctLula": 61.97183098591549,
        "pctBolsonaro": 38.028169014084504,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": true,
        "votosLula": 41,
        "votosBolsonaro": 44,
        "votosBrancosNulos": 0,
        "totalValidos": 85,
        "pctLula": 48.24,
        "pctBolsonaro": 51.76,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      }
    },
    {
      "id": "nepal",
      "country": "Nepal",
      "code": "NE",
      "continent": "Ásia",
      "flag": "🌐",
      "locais": [
        "Nepal"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 1,
        "votosBolsonaro": 11,
        "votosBrancosNulos": 0,
        "totalValidos": 12,
        "pctLula": 8.333333333333332,
        "pctBolsonaro": 91.66666666666666,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "om-",
      "country": "Omã",
      "code": "OM",
      "continent": "Ásia",
      "flag": "🌐",
      "locais": [
        "Omã"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 12,
        "votosBolsonaro": 20,
        "votosBrancosNulos": 0,
        "totalValidos": 32,
        "pctLula": 37.5,
        "pctBolsonaro": 62.5,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "palestina",
      "country": "Palestina",
      "code": "PA",
      "continent": "Ásia",
      "flag": "🌐",
      "locais": [
        "Palestina"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 1078,
        "votosBolsonaro": 46,
        "votosBrancosNulos": 0,
        "totalValidos": 1124,
        "pctLula": 95.90747330960853,
        "pctBolsonaro": 4.092526690391459,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "singapura",
      "country": "Singapura",
      "code": "SI",
      "continent": "Ásia",
      "flag": "🇸🇬",
      "locais": [
        "Singapura"
      ],
      "observacoes": "2º turno apurado: Lula 213 x Flávio 121",
      "turno1": {
        "disponivel": true,
        "votosLula": 190,
        "votosBolsonaro": 92,
        "votosBrancosNulos": 0,
        "totalValidos": 282,
        "pctLula": 67.37588652482269,
        "pctBolsonaro": 32.62411347517731,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": true,
        "votosLula": 213,
        "votosBolsonaro": 121,
        "votosBrancosNulos": 0,
        "totalValidos": 334,
        "pctLula": 63.77,
        "pctBolsonaro": 36.23,
        "winner": "Lula",
        "status": "Encerrada"
      }
    },
    {
      "id": "s-ria",
      "country": "Síria",
      "code": "SÍ",
      "continent": "Ásia",
      "flag": "🇸🇾",
      "locais": [
        "Síria"
      ],
      "observacoes": "2º turno apurado: Lula 213 x Flávio 121",
      "turno1": {
        "disponivel": true,
        "votosLula": 97,
        "votosBolsonaro": 7,
        "votosBrancosNulos": 0,
        "totalValidos": 104,
        "pctLula": 93.26923076923077,
        "pctBolsonaro": 6.730769230769231,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": true,
        "votosLula": 213,
        "votosBolsonaro": 121,
        "votosBrancosNulos": 0,
        "totalValidos": 334,
        "pctLula": 63.77,
        "pctBolsonaro": 36.23,
        "winner": "Lula",
        "status": "Encerrada"
      }
    },
    {
      "id": "tail-ndia",
      "country": "Tailândia",
      "code": "TA",
      "continent": "Ásia",
      "flag": "🇹🇭",
      "locais": [
        "Tailândia"
      ],
      "observacoes": "2º turno apurado: Lula 56 x Flávio 60",
      "turno1": {
        "disponivel": true,
        "votosLula": 40,
        "votosBolsonaro": 51,
        "votosBrancosNulos": 0,
        "totalValidos": 91,
        "pctLula": 43.956043956043956,
        "pctBolsonaro": 56.043956043956044,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": true,
        "votosLula": 56,
        "votosBolsonaro": 60,
        "votosBrancosNulos": 0,
        "totalValidos": 116,
        "pctLula": 48.28,
        "pctBolsonaro": 51.72,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      }
    },
    {
      "id": "taiwan",
      "country": "Taiwan",
      "code": "TA",
      "continent": "Ásia",
      "flag": "🇹🇼",
      "locais": [
        "Taiwan"
      ],
      "observacoes": "2º turno apurado: Lula 94 x Flávio 130",
      "turno1": {
        "disponivel": true,
        "votosLula": 77,
        "votosBolsonaro": 107,
        "votosBrancosNulos": 0,
        "totalValidos": 184,
        "pctLula": 41.84782608695652,
        "pctBolsonaro": 58.152173913043484,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": true,
        "votosLula": 94,
        "votosBolsonaro": 130,
        "votosBrancosNulos": 0,
        "totalValidos": 224,
        "pctLula": 41.96,
        "pctBolsonaro": 58.04,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      }
    },
    {
      "id": "timor-leste",
      "country": "Timor-Leste",
      "code": "TI",
      "continent": "Ásia",
      "flag": "🌐",
      "locais": [
        "Timor-Leste"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 16,
        "votosBolsonaro": 27,
        "votosBrancosNulos": 0,
        "totalValidos": 43,
        "pctLula": 37.2093023255814,
        "pctBolsonaro": 62.7906976744186,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "turquia",
      "country": "Turquia",
      "code": "TU",
      "continent": "Ásia",
      "flag": "🌐",
      "locais": [
        "Turquia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 114,
        "votosBolsonaro": 37,
        "votosBrancosNulos": 0,
        "totalValidos": 151,
        "pctLula": 75.49668874172185,
        "pctBolsonaro": 24.503311258278146,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "vietn-",
      "country": "Vietnã",
      "code": "VI",
      "continent": "Ásia",
      "flag": "🌐",
      "locais": [
        "Vietnã"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 13,
        "votosBolsonaro": 14,
        "votosBrancosNulos": 0,
        "totalValidos": 27,
        "pctLula": 48.148148148148145,
        "pctBolsonaro": 51.85185185185185,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "r-ssia",
      "country": "Rússia",
      "code": "RÚ",
      "continent": "Ásia",
      "flag": "🌐",
      "locais": [
        "Rússia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 49,
        "votosBolsonaro": 25,
        "votosBrancosNulos": 0,
        "totalValidos": 74,
        "pctLula": 66.21621621621621,
        "pctBolsonaro": 33.78378378378378,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "alemanha",
      "country": "Alemanha",
      "code": "AL",
      "continent": "Europa",
      "flag": "🇩🇪",
      "locais": [
        "Alemanha"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 13525,
        "votosBolsonaro": 3532,
        "votosBrancosNulos": 0,
        "totalValidos": 17057,
        "pctLula": 79.29295890250337,
        "pctBolsonaro": 20.707041097496628,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "-ustria",
      "country": "Áustria",
      "code": "ÁU",
      "continent": "Europa",
      "flag": "🌐",
      "locais": [
        "Áustria"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 979,
        "votosBolsonaro": 311,
        "votosBrancosNulos": 0,
        "totalValidos": 1290,
        "pctLula": 75.89147286821706,
        "pctBolsonaro": 24.108527131782946,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "b-lgica",
      "country": "Bélgica",
      "code": "BÉ",
      "continent": "Europa",
      "flag": "🇧🇪",
      "locais": [
        "Bélgica"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 2516,
        "votosBolsonaro": 1959,
        "votosBrancosNulos": 0,
        "totalValidos": 4475,
        "pctLula": 56.22346368715084,
        "pctBolsonaro": 43.77653631284916,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "bulg-ria",
      "country": "Bulgária",
      "code": "BU",
      "continent": "Europa",
      "flag": "🌐",
      "locais": [
        "Bulgária"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 34,
        "votosBolsonaro": 8,
        "votosBrancosNulos": 0,
        "totalValidos": 42,
        "pctLula": 80.95238095238095,
        "pctBolsonaro": 19.047619047619047,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "cro-cia",
      "country": "Croácia",
      "code": "CR",
      "continent": "Europa",
      "flag": "🌐",
      "locais": [
        "Croácia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 29,
        "votosBolsonaro": 17,
        "votosBrancosNulos": 0,
        "totalValidos": 46,
        "pctLula": 63.04347826086957,
        "pctBolsonaro": 36.95652173913043,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "dinamarca",
      "country": "Dinamarca",
      "code": "DI",
      "continent": "Europa",
      "flag": "🌐",
      "locais": [
        "Dinamarca"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 1166,
        "votosBolsonaro": 195,
        "votosBrancosNulos": 0,
        "totalValidos": 1361,
        "pctLula": 85.67229977957385,
        "pctBolsonaro": 14.327700220426157,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "eslov-quia",
      "country": "Eslováquia",
      "code": "ES",
      "continent": "Europa",
      "flag": "🌐",
      "locais": [
        "Eslováquia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 35,
        "votosBolsonaro": 13,
        "votosBrancosNulos": 0,
        "totalValidos": 48,
        "pctLula": 72.91666666666666,
        "pctBolsonaro": 27.083333333333332,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "eslov-nia",
      "country": "Eslovênia",
      "code": "ES",
      "continent": "Europa",
      "flag": "🌐",
      "locais": [
        "Eslovênia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 61,
        "votosBolsonaro": 25,
        "votosBrancosNulos": 0,
        "totalValidos": 86,
        "pctLula": 70.93023255813954,
        "pctBolsonaro": 29.069767441860467,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "espanha",
      "country": "Espanha",
      "code": "ES",
      "continent": "Europa",
      "flag": "🇪🇸",
      "locais": [
        "Espanha"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 7263,
        "votosBolsonaro": 3338,
        "votosBrancosNulos": 0,
        "totalValidos": 10601,
        "pctLula": 68.51240449014244,
        "pctBolsonaro": 31.487595509857563,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "est-nia",
      "country": "Estônia",
      "code": "ES",
      "continent": "Europa",
      "flag": "🌐",
      "locais": [
        "Estônia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 142,
        "votosBolsonaro": 19,
        "votosBrancosNulos": 0,
        "totalValidos": 161,
        "pctLula": 88.19875776397515,
        "pctBolsonaro": 11.801242236024844,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "finl-ndia",
      "country": "Finlândia",
      "code": "FI",
      "continent": "Europa",
      "flag": "🌐",
      "locais": [
        "Finlândia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 475,
        "votosBolsonaro": 155,
        "votosBrancosNulos": 0,
        "totalValidos": 630,
        "pctLula": 75.39682539682539,
        "pctBolsonaro": 24.6031746031746,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "fran-a",
      "country": "França",
      "code": "FR",
      "continent": "Europa",
      "flag": "🇫🇷",
      "locais": [
        "França"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 8769,
        "votosBolsonaro": 1758,
        "votosBrancosNulos": 0,
        "totalValidos": 10527,
        "pctLula": 83.30008549444287,
        "pctBolsonaro": 16.69991450555714,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "gr-cia",
      "country": "Grécia",
      "code": "GR",
      "continent": "Europa",
      "flag": "🌐",
      "locais": [
        "Grécia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 196,
        "votosBolsonaro": 230,
        "votosBrancosNulos": 0,
        "totalValidos": 426,
        "pctLula": 46.009389671361504,
        "pctBolsonaro": 53.990610328638496,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "holanda",
      "country": "Holanda",
      "code": "HO",
      "continent": "Europa",
      "flag": "🇳🇱",
      "locais": [
        "Holanda"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 4624,
        "votosBolsonaro": 1081,
        "votosBrancosNulos": 0,
        "totalValidos": 5705,
        "pctLula": 81.05170902716915,
        "pctBolsonaro": 18.94829097283085,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "hungria",
      "country": "Hungria",
      "code": "HU",
      "continent": "Europa",
      "flag": "🌐",
      "locais": [
        "Hungria"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 331,
        "votosBolsonaro": 93,
        "votosBrancosNulos": 0,
        "totalValidos": 424,
        "pctLula": 78.06603773584906,
        "pctBolsonaro": 21.933962264150946,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "irlanda",
      "country": "Irlanda",
      "code": "IR",
      "continent": "Europa",
      "flag": "🇮🇪",
      "locais": [
        "Irlanda"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 6025,
        "votosBolsonaro": 1559,
        "votosBrancosNulos": 0,
        "totalValidos": 7584,
        "pctLula": 79.44356540084388,
        "pctBolsonaro": 20.556434599156116,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "it-lia",
      "country": "Itália",
      "code": "IT",
      "continent": "Europa",
      "flag": "🇮🇹",
      "locais": [
        "Itália"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 6148,
        "votosBolsonaro": 4386,
        "votosBrancosNulos": 0,
        "totalValidos": 10534,
        "pctLula": 58.36339472185305,
        "pctBolsonaro": 41.63660527814695,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "noruega",
      "country": "Noruega",
      "code": "NO",
      "continent": "Europa",
      "flag": "🌐",
      "locais": [
        "Noruega"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 592,
        "votosBolsonaro": 198,
        "votosBrancosNulos": 0,
        "totalValidos": 790,
        "pctLula": 74.9367088607595,
        "pctBolsonaro": 25.063291139240505,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "pol-nia",
      "country": "Polônia",
      "code": "PO",
      "continent": "Europa",
      "flag": "🌐",
      "locais": [
        "Polônia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 183,
        "votosBolsonaro": 65,
        "votosBrancosNulos": 0,
        "totalValidos": 248,
        "pctLula": 73.79032258064517,
        "pctBolsonaro": 26.209677419354836,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "portugal",
      "country": "Portugal",
      "code": "PO",
      "continent": "Europa",
      "flag": "🇵🇹",
      "locais": [
        "Portugal"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 26401,
        "votosBolsonaro": 19412,
        "votosBrancosNulos": 0,
        "totalValidos": 45813,
        "pctLula": 57.627747582563906,
        "pctBolsonaro": 42.3722524174361,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "reino-unido",
      "country": "Reino Unido",
      "code": "RE",
      "continent": "Europa",
      "flag": "🇬🇧",
      "locais": [
        "Reino Unido"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 8640,
        "votosBolsonaro": 5366,
        "votosBrancosNulos": 0,
        "totalValidos": 14006,
        "pctLula": 61.68784806511495,
        "pctBolsonaro": 38.312151934885044,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "rep-blica-tcheca",
      "country": "República Tcheca",
      "code": "RE",
      "continent": "Europa",
      "flag": "🌐",
      "locais": [
        "República Tcheca"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 279,
        "votosBolsonaro": 70,
        "votosBrancosNulos": 0,
        "totalValidos": 349,
        "pctLula": 79.94269340974212,
        "pctBolsonaro": 20.057306590257877,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "rom-nia",
      "country": "Romênia",
      "code": "RO",
      "continent": "Europa",
      "flag": "🌐",
      "locais": [
        "Romênia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 31,
        "votosBolsonaro": 22,
        "votosBrancosNulos": 0,
        "totalValidos": 53,
        "pctLula": 58.490566037735846,
        "pctBolsonaro": 41.509433962264154,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "s-rvia",
      "country": "Sérvia",
      "code": "SÉ",
      "continent": "Europa",
      "flag": "🌐",
      "locais": [
        "Sérvia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 30,
        "votosBolsonaro": 13,
        "votosBrancosNulos": 0,
        "totalValidos": 43,
        "pctLula": 69.76744186046511,
        "pctBolsonaro": 30.23255813953488,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "su-cia",
      "country": "Suécia",
      "code": "SU",
      "continent": "Europa",
      "flag": "🌐",
      "locais": [
        "Suécia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 1770,
        "votosBolsonaro": 505,
        "votosBrancosNulos": 0,
        "totalValidos": 2275,
        "pctLula": 77.80219780219781,
        "pctBolsonaro": 22.197802197802197,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "su--a",
      "country": "Suíça",
      "code": "SU",
      "continent": "Europa",
      "flag": "🇨🇭",
      "locais": [
        "Suíça"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 5194,
        "votosBolsonaro": 4525,
        "votosBrancosNulos": 0,
        "totalValidos": 9719,
        "pctLula": 53.44171211029941,
        "pctBolsonaro": 46.55828788970059,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "ucr-nia",
      "country": "Ucrânia",
      "code": "UC",
      "continent": "Europa",
      "flag": "🌐",
      "locais": [
        "Ucrânia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 4,
        "votosBolsonaro": 19,
        "votosBrancosNulos": 0,
        "totalValidos": 23,
        "pctLula": 17.391304347826086,
        "pctBolsonaro": 82.6086956521739,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "argentina",
      "country": "Argentina",
      "code": "AR",
      "continent": "Américas",
      "flag": "🇦🇷",
      "locais": [
        "Argentina"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 3747,
        "votosBolsonaro": 1681,
        "votosBrancosNulos": 0,
        "totalValidos": 5428,
        "pctLula": 69.03095062638172,
        "pctBolsonaro": 30.969049373618272,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "bahamas",
      "country": "Bahamas",
      "code": "BA",
      "continent": "Américas",
      "flag": "🌐",
      "locais": [
        "Bahamas"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 6,
        "votosBolsonaro": 10,
        "votosBrancosNulos": 0,
        "totalValidos": 16,
        "pctLula": 37.5,
        "pctBolsonaro": 62.5,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "bol-via",
      "country": "Bolívia",
      "code": "BO",
      "continent": "Américas",
      "flag": "🌐",
      "locais": [
        "Bolívia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 349,
        "votosBolsonaro": 1387,
        "votosBrancosNulos": 0,
        "totalValidos": 1736,
        "pctLula": 20.1036866359447,
        "pctBolsonaro": 79.8963133640553,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "canad-",
      "country": "Canadá",
      "code": "CA",
      "continent": "Américas",
      "flag": "🇨🇦",
      "locais": [
        "Canadá"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 12508,
        "votosBolsonaro": 7043,
        "votosBrancosNulos": 0,
        "totalValidos": 19551,
        "pctLula": 63.976267198608774,
        "pctBolsonaro": 36.02373280139123,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "chile",
      "country": "Chile",
      "code": "CH",
      "continent": "Américas",
      "flag": "🇨🇱",
      "locais": [
        "Chile"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 928,
        "votosBolsonaro": 809,
        "votosBrancosNulos": 0,
        "totalValidos": 1737,
        "pctLula": 53.42544617156017,
        "pctBolsonaro": 46.57455382843984,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "col-mbia",
      "country": "Colômbia",
      "code": "CO",
      "continent": "Américas",
      "flag": "🌐",
      "locais": [
        "Colômbia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 245,
        "votosBolsonaro": 252,
        "votosBrancosNulos": 0,
        "totalValidos": 497,
        "pctLula": 49.29577464788733,
        "pctBolsonaro": 50.70422535211267,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "costa-rica",
      "country": "Costa Rica",
      "code": "CO",
      "continent": "Américas",
      "flag": "🌐",
      "locais": [
        "Costa Rica"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 173,
        "votosBolsonaro": 159,
        "votosBrancosNulos": 0,
        "totalValidos": 332,
        "pctLula": 52.108433734939766,
        "pctBolsonaro": 47.89156626506024,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "cuba",
      "country": "Cuba",
      "code": "CU",
      "continent": "Américas",
      "flag": "🌐",
      "locais": [
        "Cuba"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 36,
        "votosBolsonaro": 1,
        "votosBrancosNulos": 0,
        "totalValidos": 37,
        "pctLula": 97.2972972972973,
        "pctBolsonaro": 2.7027027027027026,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "el-salvador",
      "country": "El Salvador",
      "code": "EL",
      "continent": "Américas",
      "flag": "🌐",
      "locais": [
        "El Salvador"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 23,
        "votosBolsonaro": 48,
        "votosBrancosNulos": 0,
        "totalValidos": 71,
        "pctLula": 32.3943661971831,
        "pctBolsonaro": 67.6056338028169,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "equador",
      "country": "Equador",
      "code": "EQ",
      "continent": "Américas",
      "flag": "🌐",
      "locais": [
        "Equador"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 130,
        "votosBolsonaro": 171,
        "votosBrancosNulos": 0,
        "totalValidos": 301,
        "pctLula": 43.18936877076412,
        "pctBolsonaro": 56.810631229235874,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "estados-unidos",
      "country": "Estados Unidos",
      "code": "ES",
      "continent": "Américas",
      "flag": "🇺🇸",
      "locais": [
        "Estados Unidos"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 23335,
        "votosBolsonaro": 45004,
        "votosBrancosNulos": 0,
        "totalValidos": 68339,
        "pctLula": 34.14594887253252,
        "pctBolsonaro": 65.85405112746749,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "guatemala",
      "country": "Guatemala",
      "code": "GU",
      "continent": "Américas",
      "flag": "🌐",
      "locais": [
        "Guatemala"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 33,
        "votosBolsonaro": 67,
        "votosBrancosNulos": 0,
        "totalValidos": 100,
        "pctLula": 33,
        "pctBolsonaro": 67,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "guiana",
      "country": "Guiana",
      "code": "GU",
      "continent": "Américas",
      "flag": "🌐",
      "locais": [
        "Guiana"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 7,
        "votosBolsonaro": 43,
        "votosBrancosNulos": 0,
        "totalValidos": 50,
        "pctLula": 14.000000000000002,
        "pctBolsonaro": 86,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "guiana-francesa",
      "country": "Guiana Francesa",
      "code": "GU",
      "continent": "Américas",
      "flag": "🌐",
      "locais": [
        "Guiana Francesa"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 484,
        "votosBolsonaro": 518,
        "votosBrancosNulos": 0,
        "totalValidos": 1002,
        "pctLula": 48.30339321357285,
        "pctBolsonaro": 51.69660678642715,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "haiti",
      "country": "Haiti",
      "code": "HA",
      "continent": "Américas",
      "flag": "🌐",
      "locais": [
        "Haiti"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 5,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 5,
        "pctLula": 100,
        "pctBolsonaro": 0,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "honduras",
      "country": "Honduras",
      "code": "HO",
      "continent": "Américas",
      "flag": "🌐",
      "locais": [
        "Honduras"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 17,
        "votosBolsonaro": 34,
        "votosBrancosNulos": 0,
        "totalValidos": 51,
        "pctLula": 33.33333333333333,
        "pctBolsonaro": 66.66666666666666,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "jamaica",
      "country": "Jamaica",
      "code": "JA",
      "continent": "Américas",
      "flag": "🌐",
      "locais": [
        "Jamaica"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 4,
        "votosBolsonaro": 14,
        "votosBrancosNulos": 0,
        "totalValidos": 18,
        "pctLula": 22.22222222222222,
        "pctBolsonaro": 77.77777777777779,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "m-xico",
      "country": "México",
      "code": "MÉ",
      "continent": "Américas",
      "flag": "🇲🇽",
      "locais": [
        "México"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 585,
        "votosBolsonaro": 589,
        "votosBrancosNulos": 0,
        "totalValidos": 1174,
        "pctLula": 49.829642248722315,
        "pctBolsonaro": 50.170357751277685,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "nicar-gua",
      "country": "Nicarágua",
      "code": "NI",
      "continent": "Américas",
      "flag": "🌐",
      "locais": [
        "Nicarágua"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 33,
        "votosBolsonaro": 35,
        "votosBrancosNulos": 0,
        "totalValidos": 68,
        "pctLula": 48.529411764705884,
        "pctBolsonaro": 51.470588235294116,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "panam-",
      "country": "Panamá",
      "code": "PA",
      "continent": "Américas",
      "flag": "🌐",
      "locais": [
        "Panamá"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 236,
        "votosBolsonaro": 336,
        "votosBrancosNulos": 0,
        "totalValidos": 572,
        "pctLula": 41.25874125874126,
        "pctBolsonaro": 58.74125874125874,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "paraguai",
      "country": "Paraguai",
      "code": "PA",
      "continent": "Américas",
      "flag": "🇵🇾",
      "locais": [
        "Paraguai"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 546,
        "votosBolsonaro": 3848,
        "votosBrancosNulos": 0,
        "totalValidos": 4394,
        "pctLula": 12.42603550295858,
        "pctBolsonaro": 87.57396449704143,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "peru",
      "country": "Peru",
      "code": "PE",
      "continent": "Américas",
      "flag": "🌐",
      "locais": [
        "Peru"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 248,
        "votosBolsonaro": 380,
        "votosBrancosNulos": 0,
        "totalValidos": 628,
        "pctLula": 39.490445859872615,
        "pctBolsonaro": 60.509554140127385,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "rep-blica-dominicana",
      "country": "República Dominicana",
      "code": "RE",
      "continent": "Américas",
      "flag": "🌐",
      "locais": [
        "República Dominicana"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 65,
        "votosBolsonaro": 106,
        "votosBrancosNulos": 0,
        "totalValidos": 171,
        "pctLula": 38.01169590643275,
        "pctBolsonaro": 61.98830409356725,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "suriname",
      "country": "Suriname",
      "code": "SU",
      "continent": "Américas",
      "flag": "🌐",
      "locais": [
        "Suriname"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 121,
        "votosBolsonaro": 366,
        "votosBrancosNulos": 0,
        "totalValidos": 487,
        "pctLula": 24.84599589322382,
        "pctBolsonaro": 75.15400410677618,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "trinidad-e-tobago",
      "country": "Trinidad e Tobago",
      "code": "TR",
      "continent": "Américas",
      "flag": "🌐",
      "locais": [
        "Trinidad e Tobago"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 4,
        "votosBolsonaro": 10,
        "votosBrancosNulos": 0,
        "totalValidos": 14,
        "pctLula": 28.57142857142857,
        "pctBolsonaro": 71.42857142857143,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "uruguai",
      "country": "Uruguai",
      "code": "UR",
      "continent": "Américas",
      "flag": "🇺🇾",
      "locais": [
        "Uruguai"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 797,
        "votosBolsonaro": 701,
        "votosBrancosNulos": 0,
        "totalValidos": 1498,
        "pctLula": 53.20427236315087,
        "pctBolsonaro": 46.79572763684913,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "venezuela",
      "country": "Venezuela",
      "code": "VE",
      "continent": "Américas",
      "flag": "🌐",
      "locais": [
        "Venezuela"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 128,
        "votosBolsonaro": 125,
        "votosBrancosNulos": 0,
        "totalValidos": 253,
        "pctLula": 50.59288537549407,
        "pctBolsonaro": 49.40711462450593,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "angola",
      "country": "Angola",
      "code": "AN",
      "continent": "África",
      "flag": "🌐",
      "locais": [
        "Angola"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 147,
        "votosBolsonaro": 101,
        "votosBrancosNulos": 0,
        "totalValidos": 248,
        "pctLula": 59.2741935483871,
        "pctBolsonaro": 40.725806451612904,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "arg-lia",
      "country": "Argélia",
      "code": "AR",
      "continent": "África",
      "flag": "🌐",
      "locais": [
        "Argélia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 27,
        "votosBolsonaro": 3,
        "votosBrancosNulos": 0,
        "totalValidos": 30,
        "pctLula": 90,
        "pctBolsonaro": 10,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "cabo-verde",
      "country": "Cabo Verde",
      "code": "CA",
      "continent": "África",
      "flag": "🌐",
      "locais": [
        "Cabo Verde"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 39,
        "votosBolsonaro": 20,
        "votosBrancosNulos": 0,
        "totalValidos": 59,
        "pctLula": 66.10169491525424,
        "pctBolsonaro": 33.89830508474576,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "costa-do-marfim",
      "country": "Costa do Marfim",
      "code": "CO",
      "continent": "África",
      "flag": "🌐",
      "locais": [
        "Costa do Marfim"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 24,
        "votosBolsonaro": 13,
        "votosBrancosNulos": 0,
        "totalValidos": 37,
        "pctLula": 64.86486486486487,
        "pctBolsonaro": 35.13513513513514,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "egito",
      "country": "Egito",
      "code": "EG",
      "continent": "África",
      "flag": "🇪🇬",
      "locais": [
        "Egito"
      ],
      "observacoes": "2º turno apurado: Lula 60 x Flávio 16",
      "turno1": {
        "disponivel": true,
        "votosLula": 46,
        "votosBolsonaro": 12,
        "votosBrancosNulos": 0,
        "totalValidos": 58,
        "pctLula": 79.3103448275862,
        "pctBolsonaro": 20.689655172413794,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": true,
        "votosLula": 60,
        "votosBolsonaro": 16,
        "votosBrancosNulos": 0,
        "totalValidos": 76,
        "pctLula": 78.95,
        "pctBolsonaro": 21.05,
        "winner": "Lula",
        "status": "Encerrada"
      }
    },
    {
      "id": "gana",
      "country": "Gana",
      "code": "GA",
      "continent": "África",
      "flag": "🌐",
      "locais": [
        "Gana"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 8,
        "votosBolsonaro": 2,
        "votosBrancosNulos": 0,
        "totalValidos": 10,
        "pctLula": 80,
        "pctBolsonaro": 20,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "guin--bissau",
      "country": "Guiné-Bissau",
      "code": "GU",
      "continent": "África",
      "flag": "🌐",
      "locais": [
        "Guiné-Bissau"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 17,
        "votosBolsonaro": 17,
        "votosBrancosNulos": 0,
        "totalValidos": 34,
        "pctLula": 50,
        "pctBolsonaro": 50,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "l-bia",
      "country": "Líbia",
      "code": "LÍ",
      "continent": "África",
      "flag": "🌐",
      "locais": [
        "Líbia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 2,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 2,
        "pctLula": 100,
        "pctBolsonaro": 0,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "marrocos",
      "country": "Marrocos",
      "code": "MA",
      "continent": "África",
      "flag": "🌐",
      "locais": [
        "Marrocos"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 30,
        "votosBolsonaro": 6,
        "votosBrancosNulos": 0,
        "totalValidos": 36,
        "pctLula": 83.33333333333334,
        "pctBolsonaro": 16.666666666666664,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "mo-ambique",
      "country": "Moçambique",
      "code": "MO",
      "continent": "África",
      "flag": "🌐",
      "locais": [
        "Moçambique"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 89,
        "votosBolsonaro": 113,
        "votosBrancosNulos": 0,
        "totalValidos": 202,
        "pctLula": 44.05940594059406,
        "pctBolsonaro": 55.940594059405946,
        "winner": "Flávio Bolsonaro",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "nam-bia",
      "country": "Namíbia",
      "code": "NA",
      "continent": "África",
      "flag": "🌐",
      "locais": [
        "Namíbia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 6,
        "votosBolsonaro": 5,
        "votosBrancosNulos": 0,
        "totalValidos": 11,
        "pctLula": 54.54545454545454,
        "pctBolsonaro": 45.45454545454545,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "nig-ria",
      "country": "Nigéria",
      "code": "NI",
      "continent": "África",
      "flag": "🌐",
      "locais": [
        "Nigéria"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 26,
        "votosBolsonaro": 6,
        "votosBrancosNulos": 0,
        "totalValidos": 32,
        "pctLula": 81.25,
        "pctBolsonaro": 18.75,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "qu-nia",
      "country": "Quênia",
      "code": "QU",
      "continent": "África",
      "flag": "🇰🇪",
      "locais": [
        "Quênia"
      ],
      "observacoes": "2º turno apurado: Lula 29 x Flávio 16",
      "turno1": {
        "disponivel": true,
        "votosLula": 26,
        "votosBolsonaro": 17,
        "votosBrancosNulos": 0,
        "totalValidos": 43,
        "pctLula": 60.46511627906976,
        "pctBolsonaro": 39.53488372093023,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": true,
        "votosLula": 29,
        "votosBolsonaro": 16,
        "votosBrancosNulos": 0,
        "totalValidos": 45,
        "pctLula": 64.44,
        "pctBolsonaro": 35.56,
        "winner": "Lula",
        "status": "Encerrada"
      }
    },
    {
      "id": "senegal",
      "country": "Senegal",
      "code": "SE",
      "continent": "África",
      "flag": "🌐",
      "locais": [
        "Senegal"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 51,
        "votosBolsonaro": 24,
        "votosBrancosNulos": 0,
        "totalValidos": 75,
        "pctLula": 68,
        "pctBolsonaro": 32,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "tanz-nia",
      "country": "Tanzânia",
      "code": "TA",
      "continent": "África",
      "flag": "🌐",
      "locais": [
        "Tanzânia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 11,
        "votosBolsonaro": 5,
        "votosBrancosNulos": 0,
        "totalValidos": 16,
        "pctLula": 68.75,
        "pctBolsonaro": 31.25,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    },
    {
      "id": "tun-sia",
      "country": "Tunísia",
      "code": "TU",
      "continent": "África",
      "flag": "🌐",
      "locais": [
        "Tunísia"
      ],
      "observacoes": "Urnas em votação ou aguardando boletim oficial.",
      "turno1": {
        "disponivel": true,
        "votosLula": 12,
        "votosBolsonaro": 9,
        "votosBrancosNulos": 0,
        "totalValidos": 21,
        "pctLula": 57.14285714285714,
        "pctBolsonaro": 42.857142857142854,
        "winner": "Lula",
        "status": "Encerrada"
      },
      "turno2": {
        "disponivel": false,
        "votosLula": 0,
        "votosBolsonaro": 0,
        "votosBrancosNulos": 0,
        "totalValidos": 0,
        "pctLula": 0,
        "pctBolsonaro": 0,
        "winner": "Aguardando",
        "status": "Aguardando encerramento"
      }
    }
  ],
  "keyHighlights": [
    "Os dados de cada turno são rigorosamente independentes e NÃO se somam.",
    "Na parcial apurada do 2º turno pelo G1 (11h31), Flávio Bolsonaro lidera com 33.733 votos contra 15.578 de Lula no exterior.",
    "Lula venceu o 2º turno em 10 países (incluindo Austrália, China, Nova Zelândia, Coreia do Sul e Singapura).",
    "Flávio Bolsonaro venceu o 2º turno em 7 países (incluindo Japão com 28.538 votos, Emirados Árabes, Malásia e Taiwan)."
  ]
};
