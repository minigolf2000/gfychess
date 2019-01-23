
interface ExampleGame {
  name: string;
  pgn: string;
}

const exampleGames: ExampleGame[] = [
  // {name: "Scholar's Mate", pgn: "1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? 4.Qxf7#"},
  // {name: "Smothered Mate", pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.d4 exd4 5.O-O Nxe4 6.Re1 d5 7.Bxd5 Qxd5 8.Nc3 Qh5 9.Nxe4 Be6 10.Neg5 Bb4 11.Rxe6+ fxe6 12.Nxe6 Qf7 13.Nfg5 Qe7 14.Qe2 Bd6 15.Nxg7+ Kd7 16.Qg4+ Kd8 17.Nf7+ Qxf7 18.Bg5+ Be7 19.Ne6+ Kc8 20.Nc5+ Kb8 21.Nd7+ Kc8 22.Nb6+ Kb8 23.Qc8+ Rxc8 24.Nd7# 1-0"},
  {name: "Opera House Game", pgn: "1. e4 e5 2. Nf3 d6 3. d4 Bg4?! 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6? 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5? 10. Nxb5! cxb5 11. Bxb5+ Nbd7 12. 0-0-0 Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+! Nxb8 17. Rd8#"},
  {name: "Deep Blue vs. Garry Kasparov", pgn: "1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nd7 5.Ng5 Ngf6 6.Bd3 e6 7.N1f3 h6 (diagram) 8.Nxe6 Qe7 9.0-0 fxe6 10.Bg6+ Kd8 11.Bf4 b5 12.a4 Bb7 13.Re1 Nd5 14.Bg3 Kc8 15.axb5 cxb5 16.Qd3 Bc6 17.Bf5 exf5 18.Rxe7 Bxe7 19.c4 1–0"},

{name: "Fabiano Caruana vs. Magnus Carlsen",
pgn: `

[Event "World Championship"]
[Site "?"]
[Date "2018.11.26"]
[Round "12"]
[White "Fabiano Caruana"]
[Black "Magnus Carlsen"]
[Result "1/2-1/2"]
[ECO "B33"]
[Annotator "samsh"]
[PlyCount "62"]
[EventDate "2018.??.??"]
[CurrentPosition "r3brk1/1pq5/3p1bp1/2nP1p1p/pQP1pP1P/4B1P1/PPR1BN2/1K1R4 w - - 2 32"]

1.e4 c5 2.Nf3 Nc6 { Magnus sticks to his same Sicilian repertoire in the all
decisive final game. One can only admire his willingness to enter sharp
positions with it all on the line. } 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e5 6.Ndb5 d6 7.Nd5 Nxd5 8.exd5 Ne7!? { The first surprise. Games 8 and 10 saw 8...Nb8 } ( 8...Nb8 { And here Caruana was playing } 9.a4 { a very different plan from what we saw
in the present game. } ) 9.c4 Ng6 10.Qa4 Bd7 11.Qb4 Bf5 { Up to this point both
sides were blitzing. Caruana now thought for a bit before ultimately going for
the most testing move. } 12.h4!? { White aims to play against the g6 knight. The
threat of h4-h5 is not particularly subtle, but a bit annoying for Black to meet
since playing h7-h5 himself will leave him with a weak h5-pawn and potentially a
problem on the g5 square. } 12...h5 $146 { There had only been one human game up to
this point, and h5 is formally a novelty. But, it was contested between top
engines in the TCEC competition, so Magnus surely was familiar with the ideas.
He was still blitzing out his prep at this point. } ( 12...a6? { would be well met
by } 13.h5! { when White has an excellent position. } ) ( { [That was in fact played
in the recent game Kramnik-Roganovic, Batumi Olympiad 2018 which continued } 12...a6 13.h5 Nf4 14.Nc3 Be7 15.Be3 Nd3+ 16.Bxd3 Bxd3 17.h6 { and White won
in 42 moves. - ed.] } ) 13.Qa4 Bd7 14.Qb4 Bf5 15.Be3 { No early draws this
time! } ( 15.Bg5!? { may have been a more critical move. Still, I am sure Magnus
would have been ready for it. } 15...Qb8 16.Be2 a6 17.Nc3 Nf4 18.Bf1 Be7 19.Bxe7 Kxe7 20.g3 Ng6 { and a draw after 59 moves in Houdini 6.03-Stockfish
earlier this year. } ) 15...a6 { The first move Magnus thought about. } ( 15...Be7!? { The machine thinks giving the a7-pawn is interesting. It might be right
but it looks risky to me. } 16.Bxa7 O-O 17.g3 Be4 { Otherwise White just goes
Bg2 with an extra pawn } 18.Rg1 Bf3 { Black has obvious compensation, but I'm not
fully convinced it is enough. } ) 16.Nc3 Qc7 ( 16...Be7 { Again, Black could have
pitched the pawn to speed up his development. But I don't really mind Magnus'
choice. He clearly understood the resulting middlegame better than Caruana. } ) 17.g3 Be7 18.f3?! { The first dubious move of the game. Perhaps White was
worried about e5-e4 then Ng6-e5 can come to solve the problem of the poorly
placed g6-knight, but this strikes me as too defensive and too slow. } ( 18.Be2 { The computer flirts with weird checks on a4. This move looks by far the most
natural to me. } 18...e4 19.Bb6 Qd7 20.Bd4 { White looks better to me, but of
course it is still complicated. } ) 18...Nf8! { One bad piece makes a bad
position, and White's play has been slow enough that Black has time for Nf8-d7
before castling. } 19.Ne4 Nd7 20.Bd3 O-O 21.Rh2?! { White's second dubious
decision. It's not such a silly way to develop the rook as it clearly belongs on
the c-file. but it appears to articifial to me. } ( 21.O-O { Sometimes boring is
prudent. I don't think White is better, but he is definitely not worse and has a
fair plan to expand with c4-c5 eventually. } ) 21...Rac8 ( 21...Bg6 { Preparing
f7-f5 immediately was fine as well. I suspect Carlsen did not want to allow
White to respond with } 22.g4 { Though here Black is also better after the
accurate response } 22...Nf6! ) 22.O-O-O Bg6! { f7-f5 is coming. Black is setting
his central pawn majority in motion while White's queenside is badly stalled-
c4-c5 looks impossible to ever pull off. I think Black is already seriously
better. Note that Carlsen chose this moment to go for Bf5-g6 since White cannot
comfortably play g3-g4 in response due to the hanging c-pawn. } 23.Rc2 ( 23.g4? hxg4! 24.fxg4 Bxe4! { The point. White loses the c4-pawn, and the game. } ) 23...f5 24.Nf2 ( 24.Ng5 { The computers prefer this move by a wide margin, but I
still would not want to be White after something like } 24...Bxg5 25.hxg5 e4! 26.Bf1 ( 26.fxe4 fxe4 27.Be2 Ne5 { Also looks awful } ) 26...f4! { When the
bishop on g6 becomes a monster. } 27.Bxf4 Nc5 { Black's attack is extremely
dangerous. } ) 24...Nc5 { Around here, I thought Magnus would win the game, and in
fine style to close out the match after eleven draws. White's position looks
miserable. } 25.f4 a5!? { This move is not best. But it doesn't really bother me-
I think Black should still win. } ( 25...exf4 { Sesse claims opening the position
was the best way. White will either lose the h4-pawn after } 26.gxf4 ( 26.Bxf4 { Or this can be met with } 26...b5! { When the queenside is blasted open.
Technically this may be best, but White suddenly has a solid looking position, a
good bishop on f4, and the g6-bishop is not inspiring. Magnus's choice is no
worse in my opinion. } ) 26...Bxh4 { and White has no meaningful compensation } ) ( 25...b5 { This also looks very strong, and may be the most human way to bring
in the full point. Black forces open the queenside. The machine's recommendation
of } 26.Bxc5 dxc5 27.Qd2 Bd6 { Looks rather hopeless for White to me. Eventually
he will lose on the dark squares. } ) 26.Qd2 e4 { White is completely stuck, has
no counterplay, no plan. But the position is locked. All Black has to do is get
the b7-b5 advance through. If he manages, he should win. And he should manage. } 27.Be2 Be8 28.Kb1 Bf6 29.Re1 a4?? { Much like I did to Caruana for playing
h2-h3 in game 8, I am giving an exceptionally harsh evaluation to Magnus for
this move, which is totally not in the spirit of the position. His only plan to
win the game is b7-b5. It should be enough if he manages under decent
circumstances. But now, he has cleared the b4-square for White's queen! This
makes his task significantly harder, if not impossible. In addition, the pawn on
a4 deprives Black's knight and bishop access to this square, which both pieces
would want to use. Magnus said this was prophylaxis against Bd4 due to Nb3, but
it still doesn't come close to justifying allowing the queen to b4. } ( 29...Ba4! { This was the most convincing route to victory according to the machine, and
Caruana mentioned it was what he was most concerned about. Black wins in all
lines, for instance } 30.b3 ( 30.Bxh5 { This looks like a little bit of
counterplay but Black wins the race after } 30...Bxc2+ 31.Qxc2 b5! 32.Bg6 bxc4 33.Qe2 Rb8 { Black mates first. } ) ( 30.Rcc1 b5! 31.cxb5 Qb6 { The b-file opens,
and Black should win. } ) 30...Bxb3! 31.axb3 Nxb3 32.Qd1 a4! { And Black can
just ignore White's extra piece, which is meaningless. b7-b5 comes next. Still,
this is hard to do in an OTB game. I don't really mind Magnus not playing Ba4.
Playing a4 was what I took issue with. } ) ( 29...Rb8!? { A move like this one is
what I would expect a human to do. b5 is coming and White can't do anything
about it. } 30.Bd4 { A bad move, but what else? In addition to Nd3 winning
material, this position is also just wretched after the simple } 30...Bxd4 31.Qxd4 b5 { Black should win, easily. } ) ( 29...g6 { Even a patient waiting move like
this might be enough. } ) 30.Qb4! { Now how will b5 come? Black has no other way
to open the position. } 30...g6 31.Rd1 Ra8 { Magnus has gotten a lot of grief
for offering a draw here, from both club level online kibitzers to past World
Champions. I'll spare him my full thoughts on the matter, but I will say I don't
really understand his decision. He faces absolutely no risk ever and still has
some plans at his disposal to try to get b5 through, with as Bd7, Rrb8, etc.
Maybe White is holding, maybe he isn't. I'd need to look a lot longer to draw
any conclusions. But I really think Black should have played, at least until
time control. All that said, I still think he is a favorite in the playoff. His
rapid and blitz skills have long been atop the world, and I do think he played
better overall chess in the classical portion (if this can ever be said for a
6-6 tie with no decisive games). Still, while he is a favorite in the playoff,
his victory is by no means gauranteed. Upsets can happen, and Magnus would do
well to try not to be tilted by both starting and ending the match by drawing a
winning position with Black. }  1/2-1/2

`}]

export default exampleGames;

