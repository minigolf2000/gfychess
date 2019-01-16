
interface ExampleGame {
  name: string;
  pgn: string;
}

const exampleGames: ExampleGame[] = [
  // {name: "Scholar's Mate", pgn: "1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? 4.Qxf7#"},
  // {name: "Smothered Mate", pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.d4 exd4 5.O-O Nxe4 6.Re1 d5 7.Bxd5 Qxd5 8.Nc3 Qh5 9.Nxe4 Be6 10.Neg5 Bb4 11.Rxe6+ fxe6 12.Nxe6 Qf7 13.Nfg5 Qe7 14.Qe2 Bd6 15.Nxg7+ Kd7 16.Qg4+ Kd8 17.Nf7+ Qxf7 18.Bg5+ Be7 19.Ne6+ Kc8 20.Nc5+ Kb8 21.Nd7+ Kc8 22.Nb6+ Kb8 23.Qc8+ Rxc8 24.Nd7# 1-0"},
  {name: "Opera House Game", pgn: "1. e4 e5 2. Nf3 d6 3. d4 Bg4?! 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6? 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5? 10. Nxb5! cxb5 11. Bxb5+ Nbd7 12. 0-0-0 Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+! Nxb8 17. Rd8#"},
  // {name: "Deep Blue vs. Garry Kasparov, 1997, Game 6", pgn: "1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nd7 5.Ng5 Ngf6 6.Bd3 e6 7.N1f3 h6 (diagram) 8.Nxe6 Qe7 9.0-0 fxe6 10.Bg6+ Kd8 11.Bf4 b5 12.a4 Bb7 13.Re1 Nd5 14.Bg3 Kc8 15.axb5 cxb5 16.Qd3 Bc6 17.Bf5 exf5 18.Rxe7 Bxe7 19.c4 1–0"},
  {name: "Lichess", pgn: `
[Event "Rated Blitz game"]
[Site "https://lichess.org/XNb1Rzwh"]
[Date "2018.10.21"]
[Round "-"]
[White "locovidal"]
[Black "minigolf2000"]
[Result "0-1"]
[UTCDate "2018.10.21"]
[UTCTime "00:07:09"]
[WhiteElo "1233"]
[BlackElo "1220"]
[WhiteRatingDiff "-11"]
[BlackRatingDiff "+13"]
[Variant "Standard"]
[TimeControl "300+3"]
[ECO "C50"]
[Opening "Giuoco Piano"]
[Termination "Normal"]
[Annotator "lichess.org"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 { C50 Giuoco Piano } 4. O-O d6 5. d3 Bg4 6. Nbd2 Nd4 7. h3 Bh5 8. g4 Bg6 9. Nxd4 Bxd4 10. c3 Bb6 11. Kh2?! { (0.09 → -0.45) Inaccuracy. Best move was a4. } (11. a4 c6 12. Nf3 Ne7 13. Bb3 h5 14. Nh4 Qd7 15. a5 Bc7 16. Nxg6 Nxg6 17. Be3 hxg4) 11... Qf6? { (-0.45 → 0.61) Mistake. Best move was h5. } (11... h5 12. g5 Qxg5 13. Nf3 Qe7 14. Bg5 Nf6 15. a4 c6 16. Kg2 Bc7 17. Nh4 O-O-O 18. Nxg6) 12. Qf3? { (0.61 → -0.46) Mistake. Best move was Nf3. } (12. Nf3 Qe7 13. a4 a5 14. Rb1 Nf6 15. Nh4 Nd7 16. g5 c6 17. b4 axb4 18. cxb4 O-O) 12... O-O-O?! { (-0.46 → 0.16) Inaccuracy. Best move was h5. } (12... h5 13. Qxf6 gxf6 14. f3 Ne7 15. a4 O-O-O 16. a5 Be3 17. a6 Bf4+ 18. Kg2 b6 19. Nb3) 13. Qxf6?! { (0.16 → -0.45) Inaccuracy. Best move was Qg3. } (13. Qg3 Qe7 14. Bb3 c6 15. Nc4 Bc7 16. f4 f6 17. fxe5 fxe5 18. Ne3 Nf6 19. Nf5 Bxf5) 13... Nxf6 14. f4? { (-0.25 → -1.37) Mistake. Best move was Nf3. } (14. Nf3 c6 15. Bb3 Nd7 16. Be3 f6 17. Nh4 Bxe3 18. fxe3 Kc7 19. Kg3 Nc5 20. Bc2 Ne6) 14... h5?? { (-1.37 → 1.94) Blunder. Best move was exf4. } (14... exf4 15. d4) 15. f5? { (1.94 → 0.00) Mistake. Best move was g5. } (15. g5 d5 16. gxf6 dxc4 17. fxg7 Rhg8 18. f5 Bh7 19. f6 cxd3 20. b3 h4 21. Nc4 Bxe4) 15... Bh7? { (0.00 → 1.71) Mistake. Best move was hxg4. } (15... hxg4 16. fxg6 Rxh3+ 17. Kg2 Nh5 18. gxf7 Rg3+ 19. Kh2 Rh3+) 16. g5 Nd7?! { (1.76 → 2.45) Inaccuracy. Best move was d5. } (16... d5) 17. Bxf7 Rdf8?! { (2.26 → 2.98) Inaccuracy. Best move was Nc5. } (17... Nc5 18. Rf3 Bg8 19. Bxg8 Rhxg8 20. a4 a5 21. b4 axb4 22. cxb4 Na6 23. Rb1 Bd4 24. Nc4) 18. Bb3?! { (2.98 → 2.42) Inaccuracy. Best move was Be6. } (18. Be6 Bg8 19. Bxd7+ Kxd7 20. Nf3 c6 21. g6 h4 22. Bg5 Bd8 23. Bxd8 Rxd8 24. b3 b6) 18... g6 19. f6 Be3 20. Nf3 Bf4+? { (3.21 → 5.25) Mistake. Best move was Bxc1. } (20... Bxc1 21. Rfxc1 a6 22. d4 Bg8 23. Kg3 Bxb3 24. axb3 c6 25. b4 Kc7 26. Rd1 Rh7 27. Nh4) 21. Kg2? { (5.25 → 3.19) Mistake. Best move was Bxf4. } (21. Bxf4 exf4 22. d4 Bg8 23. Nh4 Nxf6 24. Nxg6 Bxb3 25. Nxh8 Rxh8 26. axb3 Nxe4 27. Rxa7 Kd7) 21... Bg8? { (3.19 → 4.89) Mistake. Best move was Bxc1. } (21... Bxc1 22. Rfxc1 a6 23. d4 Bg8 24. Bxg8 Rfxg8 25. Kg3 c6 26. b4 Kc7 27. Rf1 Rh7 28. Rad1) 22. Bxf4 exf4 23. h4?! { (4.87 → 4.01) Inaccuracy. Best move was Nh4. } (23. Nh4 Bxb3 24. axb3 Rhg8 25. Rxa7 Kb8 26. Rfa1 c5 27. d4 Kc7 28. Kf3 Nxf6 29. gxf6 g5) 23... Bxb3 24. axb3 c5?! { (4.12 → 4.64) Inaccuracy. Best move was a6. } (24... a6 25. d4 Re8 26. Nd2 Nb6 27. Rae1 Kd7 28. Rxf4 Rhf8 29. e5 d5 30. Kg3 Ke6 31. Rff1) 25. Rxa7 Ne5? { (4.45 → 7.22) Mistake. Best move was Re8. } (25... Re8 26. Ra4 Kc7 27. Ne1 Ne5 28. Rxf4 Nc6 29. Kg3 Kd7 30. Nf3 Ra8 31. d4 cxd4 32. cxd4) 26. Nxe5 dxe5 27. Rf3? { (6.74 → 4.87) Mistake. Best move was Ra5. } (27. Ra5 Kd7 28. Rxc5 Ke6 29. d4 exd4 30. cxd4 Rc8 31. Re5+ Kd6 32. Rxf4 Rh7 33. Rd5+ Ke6) 27... Kc7 28. Ra4?! { (5.11 → 4.26) Inaccuracy. Best move was d4. } (28. d4 exd4 29. cxd4 Re8 30. dxc5 Rxe4 31. Ra4 Re2+ 32. Rf2 Re5 33. Rc4 Kc6 34. b4 b6) 28... Kc6? { (4.26 → 5.58) Mistake. Best move was Rd8. } (28... Rd8 29. b4 b6 30. bxc5 bxc5 31. d4 exd4 32. Rc4 Kd6 33. cxd4 cxd4 34. Rd3 Ke6 35. Kf3) 29. d4 cxd4? { (5.10 → 6.51) Mistake. Best move was exd4. } (29... exd4) 30. cxd4 Kd6 31. dxe5+ Kxe5 32. Ra5+ Kxe4 33. Ra4+ Ke5 34. Rfxf4 Rd8 35. Rae4+ Kd6 36. Rd4+?! { (5.45 → 4.95) Inaccuracy. Best move was Kf3. } (36. Kf3 b5 37. Re7 Kc5 38. b4+ Kd5 39. Rc7 Kd6 40. Rg7 Rhg8 41. Rd4+ Ke5 42. Re4+ Kd6) 36... Kc7? { (4.95 → 5.97) Mistake. Best move was Kc5. } (36... Kc5 37. Rc4+) 37. Rxd8 Rxd8?! { (5.55 → 6.29) Inaccuracy. Best move was Kxd8. } (37... Kxd8 38. Kf3 Kd7 39. Rd4+ Kc6 40. Re4 Kd6 41. Re7 Rd8 42. Rxb7 Re8 43. b4 Re1 44. b5) 38. f7 Rf8 39. Rf6 Kd7 40. Rxg6? { (5.39 → 3.60) Mistake. Best move was Kg3. } (40. Kg3) 40... Rxf7 41. Rf6 Re7 42. g6 Ke8?? { (4.73 → 8.14) Blunder. Best move was Re4. } (42... Re4 43. Rf3) 43. Rf5?? { (8.14 → 4.50) Blunder. Best move was Kf3. } (43. Kf3 Re1 44. g7 Rf1+ 45. Ke4 Rxf6 46. g8=Q+ Kd7 47. Qg7+ Ke6 48. Qxb7 Rf7 49. Qc6+ Ke7) 43... Rg7 44. Rg5 Ke7?? { (3.90 → 8.31) Blunder. Best move was Rg8. } (44... Rg8 45. Kg3) 45. Kf3 Kf6? { (6.97 → 8.22) Mistake. Best move was Kf8. } (45... Kf8 46. Kf4) 46. Kf4 Ke6 47. Rxh5?? { (7.45 → 3.18) Blunder. Best move was Re5+. } (47. Re5+) 47... Rxg6 48. Rg5?! { (3.12 → 2.45) Inaccuracy. Best move was Rb5. } (48. Rb5 Rf6+ 49. Kg5 Rf1 50. h5 Rg1+ 51. Kh6 Kf6 52. Rb6+ Kf5 53. Rxb7 Rg2 54. Rb5+ Kf6) 48... Rf6+ 49. Kg4 Rf7 50. Rg6+ Kd5?? { (2.45 → 5.82) Blunder. Best move was Ke5. } (50... Ke5 51. h5 Rf1 52. Kg5 Rf5+ 53. Kh4 Rf2 54. Rb6 Kf5 55. Rxb7 Rf4+ 56. Kg3 Rg4+ 57. Kf3) 51. h5 Rf2 52. Kg3? { (5.47 → 3.77) Mistake. Best move was h6. } (52. h6) 52... Rf1 53. Kg2?! { (4.02 → 3.27) Inaccuracy. Best move was Rb6. } (53. Rb6) 53... Rf8 54. Rg5+? { (3.61 → 2.33) Mistake. Best move was h6. } (54. h6) 54... Ke6 55. Rg3 Kf6?? { (2.05 → 52.29) Blunder. Best move was Rd8. } (55... Rd8) 56. Kh3?? { (52.29 → 1.38) Blunder. Best move was Rf3+. } (56. Rf3+) 56... Re8?! { (1.38 → 2.24) Inaccuracy. Best move was Rd8. } (56... Rd8 57. Rg6+ Kf5 58. Rb6 Rd3+ 59. Kh4 Rd4+ 60. Kg3 Rd3+ 61. Kf2 Kg4 62. h6 Rh3 63. b4) 57. Kh4?! { (2.24 → 1.46) Inaccuracy. Best move was Rg6+. } (57. Rg6+ Kf5 58. Rb6 Re3+ 59. Kh4 Re4+ 60. Kg3 Kg5 61. Rb5+ Kh6 62. b4 Re7 63. Kf4 Rg7) 57... Re4+?! { (1.46 → 2.25) Inaccuracy. Best move was b5. } (57... b5) 58. Rg4 Re1 59. Rg3?! { (2.28 → 1.32) Inaccuracy. Best move was Rb4. } (59. Rb4 Rh1+ 60. Kg4 Rg1+ 61. Kf4 Rf1+ 62. Ke4 Re1+ 63. Kd3 Rd1+ 64. Kc2 Rd7 65. Rb5 Rf7) 59... Kf5? { (1.32 → 2.92) Mistake. Best move was Rh1+. } (59... Rh1+ 60. Rh3 Rf1 61. Rh2 Rd1 62. Rg2 Rh1+ 63. Kg4 Kg7 64. Rd2 Rg1+ 65. Kf3 Kh6 66. Rd5) 60. Kh3? { (2.92 → 0.00) Mistake. Best move was Rf3+. } (60. Rf3+ Ke6 61. h6 Rh1+ 62. Kg5 Rg1+ 63. Kh5 Rh1+ 64. Kg6 Rg1+ 65. Kh7 Rg2 66. Rf4 b5) 60... Rh1+ 61. Kg2 Rxh5 62. Rg7 b5 63. Rf7+ Ke4 64. Re7+ Kd5 65. Kf3 Rf5+ 66. Kg2 b4 67. Rb7 Kc5 68. Kg3 Rd5 69. Rc7+ Kb5 70. Rc2 Rd3+ 71. Kf4 Rxb3 72. Ke4 Rh3 73. Kd4 Rh4+ 74. Kd5 b3 75. Rd2 Rh8 76. Ke5 Kc4 77. Kf5 Rf8+ 78. Ke6 Rc8 79. Kd6?? { (0.00 → Mate in 10) Checkmate is now unavoidable. Best move was Ke5. } (79. Ke5 Ra8 80. Ke4 Ra2 81. Ke5) 79... Rd8+ { White resigns. } 0-1
`},
{name: "Chess.com", pgn: `
[Event "Live Chess"]
[Site "Chess.com"]
[Date "2019.01.15"]
[White "MiniGolf2000"]
[Black "Computer6"]
[Result "0-1"]
[ECO "B52"]
[WhiteElo "1102"]
[BlackElo "1403"]
[TimeControl "300"]
[EndTime "22:33:23 PST"]
[Termination "Computer6 won on time"]
[CurrentPosition "3k4/p4ppp/4n3/P1p5/2P5/BnN1PpP1/5P1P/6K1 w - - 0 25"]

1.e4 {[%clk 0:04:59]} c5 {[%clk 0:04:59]} 2.Nf3 {[%clk 0:04:49]} d6 {[%clk 0:04:59]} 3.Bb5+ {[%clk 0:04:43]} Bd7 {[%clk 0:04:59]} 4.a4 {[%clk 0:04:35]} Nf6 {[%clk 0:04:59]} 5.Qe2 {[%clk 0:04:25]} Bxb5 {[%clk 0:04:59]} 6.Qxb5+ {[%clk 0:04:20]} Nbd7 {[%clk 0:04:59]} 7.Qxb7 {[%clk 0:04:16]} e5 {[%clk 0:04:59]} 8.a5 {[%clk 0:03:45]} d5 {[%clk 0:04:59]} 9.exd5 {[%clk 0:03:38]} e4 {[%clk 0:04:59]} 10.O-O {[%clk 0:02:59]} exf3 {[%clk 0:04:59]} 11.Re1+ {[%clk 0:02:58]} Be7 {[%clk 0:04:58]} 12.d6 {[%clk 0:02:39]} Rb8 {[%clk 0:04:58]} 13.dxe7 {[%clk 0:01:52]} Rxb7 {[%clk 0:04:58]} 14.exd8=Q+ {[%clk 0:01:50]} Kxd8 {[%clk 0:04:58]} 15.g3 {[%clk 0:01:25]} Re8 {[%clk 0:04:58]} 16.Re3 {[%clk 0:01:08]} Rxe3 {[%clk 0:04:58]} 17.dxe3 {[%clk 0:01:05]} Nf8 {[%clk 0:04:58]} 18.Nc3 {[%clk 0:00:54]} Ne6 {[%clk 0:04:58]} 19.b3 {[%clk 0:00:37]} Rd7 {[%clk 0:04:58]} 20.Ba3 {[%clk 0:00:31]} Rd2 {[%clk 0:04:58]} 21.Rd1 {[%clk 0:00:14]} Rxd1+ {[%clk 0:04:57]} 22.Nxd1 {[%clk 0:00:13]} Ne4 {[%clk 0:04:57]} 23.c4 {[%clk 0:00:07]} Nd2 {[%clk 0:04:57]} 24.Nc3 {[%clk 0:00:02]} Nxb3 {[%clk 0:04:57]}  0-1

`}]

export default exampleGames;

