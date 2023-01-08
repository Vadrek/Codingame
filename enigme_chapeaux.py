
"""
chapeaux A,B,C
persones 1,2,3

tous les 27 cas :
AAA, AAB, AAC, ABA, ABB, ABC, ACA, ACB, ACC
BAA, BAB, BAC, BBA, BBB, BBC, BCA, BCB, BCC
CAA, CAB, CAC, CBA, CBB, CBC, CCA, CCB, CCC

Les 3 cas des 3 identiques et les 6 cas des 3 différents sont traités par un joueur

Il reste 18 :
AAB, AAC, ABA, ABB, ACA, ACC
BAA, BAB, BBA, BBC, BCB, BCC
CAA, CAC, CBB, CBC, CCA, CCB

Si le joueur 1 en voit 2 pareil, il dit la couleur d'après (s'il voit BB il dit C)
Si le joueur 2 en voit 2 pareil, il dit la couleur d'avant (s'il voit BB il dit A)
Il reste 12 :
AAB, AAC, ABA, ABB
BBA, BBC, BCB, BCC
CAA, CAC, CCA, CCB

Si le joueur 1 voit 2 différents, il dit le plus petit (s'il voit AB il dit A, s'il voit AC il dit C, et BC il dit B)
Si le joueur 2 voit 2 différents, il dit le plus gros (s'il voit AB il dit B, s'il voit AC il dit A, et BC il dit C)
Il reste 3 :
ABA
BCB
CAC

3 cas possibles :
- tous chapeaux même couleur : AAA
- AAB
- ABC

2 possibilités pour un individu :
- il voit 2 chapeaux identiques : AA
- il voit 2 chapeaux différents : AB


cas chapeaux AAB
le perso 3 va dire A, car en cas de 3 chapeaux identiques c'est lui qui le dit
les autres voient AB en face. Y'en a 1 qui va dire

cas chapeaux ABA
le perso 3 va dire C car en cas de 3 chapeaux différents c'est lui qui dit
le 1 voit AB : il ne va pas dire C
le 2 voit AA : il ne va pas dire A

perso 3 inutile
Le perso 1 voit AB dans les cas : AAB, BAB
Le perso 2 voit AB dans les cas : AAB, ABB et il voit BB dans les cas BAB BCB
AAB, ABB : perso 2 dira la même chose : A. Dans le cas ABB, perso 1 doit donc dire A
BAB, BCB : pareil


Il reste 18 :
AAB, AAC, ABA, ABB, ACA, ACC
BAA, BAB, BBA, BBC, BCB, BCC
CAA, CAC, CBB, CBC, CCA, CCB

Le joueur 2 doit départager AAB de BAB, mais aussi CCB de BCB
"""