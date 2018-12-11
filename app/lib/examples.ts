
interface ExampleGame {
  name: string;
  pgn: string;
}

const exampleGames: ExampleGame[] = [
  {name: "Scholar's Mate", pgn: "1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? 4.Qxf7#"},
  {name: "Smothered Mate", pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.d4 exd4 5.O-O Nxe4 6.Re1 d5 7.Bxd5 Qxd5 8.Nc3 Qh5 9.Nxe4 Be6 10.Neg5 Bb4 11.Rxe6+ fxe6 12.Nxe6 Qf7 13.Nfg5 Qe7 14.Qe2 Bd6 15.Nxg7+ Kd7 16.Qg4+ Kd8 17.Nf7+ Qxf7 18.Bg5+ Be7 19.Ne6+ Kc8 20.Nc5+ Kb8 21.Nd7+ Kc8 22.Nb6+ Kb8 23.Qc8+ Rxc8 24.Nd7# 1-0"},
  {name: "Opera House Game", pgn: "1.e4 e5 2.Nf3 d6 3.d4 Bg4 4.dxe5 Bxf3 5.Qxf3 dxe5 6.Bc4 Nf6 7.Qb3 Qe7"},
]

export default exampleGames;
