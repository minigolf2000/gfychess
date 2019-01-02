
interface ExampleGame {
  name: string;
  pgn: string;
}

const exampleGames: ExampleGame[] = [
  {name: "Scholar's Mate", pgn: "1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? 4.Qxf7#"},
  {name: "Smothered Mate", pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.d4 exd4 5.O-O Nxe4 6.Re1 d5 7.Bxd5 Qxd5 8.Nc3 Qh5 9.Nxe4 Be6 10.Neg5 Bb4 11.Rxe6+ fxe6 12.Nxe6 Qf7 13.Nfg5 Qe7 14.Qe2 Bd6 15.Nxg7+ Kd7 16.Qg4+ Kd8 17.Nf7+ Qxf7 18.Bg5+ Be7 19.Ne6+ Kc8 20.Nc5+ Kb8 21.Nd7+ Kc8 22.Nb6+ Kb8 23.Qc8+ Rxc8 24.Nd7# 1-0"},
  {name: "Opera House Game", pgn: "1.e4 e5 2.Nf3 d6 3.d4 Bg4 4.dxe5 Bxf3 5.Qxf3 dxe5 6.Bc4 Nf6 7.Qb3 Qe7"},
  // {name: "Deep Blue vs. Garry Kasparov, 1997, Game 6", pgn: "1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nd7 5.Ng5 Ngf6 6.Bd3 e6 7.N1f3 h6 (diagram) 8.Nxe6 Qe7 9.0-0 fxe6 10.Bg6+ Kd8 11.Bf4 b5 12.a4 Bb7 13.Re1 Nd5 14.Bg3 Kc8 15.axb5 cxb5 16.Qd3 Bc6 17.Bf5 exf5 18.Rxe7 Bxe7 19.c4 1–0"},
]

export default exampleGames;

