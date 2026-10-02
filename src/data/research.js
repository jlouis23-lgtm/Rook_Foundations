// Content for the Research Behind Our Approach page (/references).
//
// Everything a visitor reads on that page lives here, apart from the page's
// own introduction. To add or change a research strand, edit this file only:
// the map, the slide-over panel and the "browse by list" section are all
// generated from `topics`.
//
// Each topic has:
//   id / title / preview   how it appears on the map
//   accent / deep          accent is for lines and dots; deep is a darker shade
//                          of the same colour that meets 4.5:1 contrast on the
//                          page background, so it is the one used for text
//   story                  a short plain-English walk through the evidence.
//                          Blocks of kind 'caveat' are styled as the honest
//                          "but" at the end. Every claim here is drawn from the
//                          studies listed in `refs`.
//   refs                   the underlying studies (citation, what it found,
//                          link, and how closely it relates to the games we use)

// How closely each study relates to the games we use. Shown beside every
// reference, in words, so the distinction never relies on colour alone.
export const evidenceLabels = {
  game: 'Studied this kind of game',
  related: 'Related research',
  guidance: 'Evidence review',
  theory: 'Theory',
};

export const evidenceKey = [
  { level: 'game', meaning: 'The research tested a game or puzzle directly.' },
  { level: 'related', meaning: 'It studied a comparable activity or an underlying skill, so it can help explain why a game might be useful, but it cannot show that a particular game works.' },
  { level: 'guidance', meaning: 'A review of other studies, or official guidance.' },
  { level: 'theory', meaning: 'A foundational idea, not a test of games.' },
];

export const topics = [
  {
    id: 'chess-in-schools',
    title: 'Chess in Schools: What Does the Research Show?',
    preview: 'What can chess teach us, and where does the evidence stop?',
    accent: '#b8790a',
    deep: '#8a5a06',
    story: [
      {
        label: 'The question everyone asks first',
        body: [
          'Does teaching children chess make them better at maths, reading or thinking more generally? It is the question most parents and schools ask, so it is where we started.',
        ],
      },
      {
        label: 'What researchers found',
        body: [
          'The largest UK trial gave 100 primary schools in England 30 hours of chess lessons and followed 4,009 Year 5 pupils. A year later there was no difference in maths, reading or science results.',
          'Other studies are more hopeful. One review of 24 studies found a small to moderate average benefit, and a Danish study saw maths scores rise slightly. But when chess was compared with another engaging activity, the benefit tended to shrink or disappear, and the better designed the study, the smaller the effect.',
        ],
      },
      {
        label: 'What this means for how we teach',
        body: [
          'We do not promise that chess will lift exam results. We teach it because many children enjoy it (half the pupils in the English trial said they liked the lessons a lot, and their teachers were positive) and because it gives children something genuine to think about and talk through.',
        ],
      },
      {
        kind: 'caveat',
        label: 'But there is an important caveat',
        body: [
          'Much of the more encouraging evidence is early. The Spanish after-school study compared children who had chosen chess with children who had chosen football or basketball, so the groups may have differed to begin with. A 2025 study of 5 to 6 year olds in China had no random assignment and no long-term follow-up. We treat both as encouraging rather than settled.',
        ],
      },
    ],
    refs: [
      {
        citation: "Jerrim, J., Macmillan, L., Micklewright, J., Sawtell, M., & Wiggins, M. (2016). Chess in Schools: Evaluation report and executive summary. Education Endowment Foundation.",
        detail: "The largest UK trial of chess teaching: 100 primary schools in England and 4,009 Year 5 pupils, with schools randomly chosen to receive 30 hours of chess lessons. One year later there was no difference in maths, reading or science results. Half of the pupils said they liked the lessons a lot, and teachers were positive about them.",
        url: "https://eric.ed.gov/?id=ED581100",
        level: "game",
      },
      {
        citation: "Sala, G., & Gobet, F. (2016). Do the benefits of chess instruction transfer to academic and cognitive skills? A meta-analysis. Educational Research Review, 18, 46–57.",
        detail: "Pooled 24 studies of chess teaching and found a small to moderate average benefit. The authors warn that most of the studies did not compare chess with another engaging activity, so the benefit may not be down to chess itself.",
        url: "https://doi.org/10.1016/j.edurev.2016.02.002",
        level: "game",
      },
      {
        citation: "Sala, G., & Gobet, F. (2017). Does chess instruction improve mathematical problem-solving ability? Two experimental studies with an active control group. Learning & Behavior, 45.",
        detail: "Two experiments with pupils aged about 8 to 10 compared chess with another board game and with no extra activity. There was no significant difference in maths problem solving between the groups.",
        url: "https://doi.org/10.3758/s13420-017-0280-3",
        level: "game",
      },
      {
        citation: "Sala, G., & Gobet, F. (2017). Does far transfer exist? Negative evidence from chess, music, and working memory training. Current Directions in Psychological Science, 26(6).",
        detail: "Reviews chess, music and memory training together. The better designed a study was, the smaller the benefit it found. The authors conclude that skills learned in one area rarely carry over to unrelated areas.",
        url: "https://doi.org/10.1177/0963721417712760",
        level: "game",
      },
      {
        citation: "Rosholm, M., Mikkelsen, M. B., & Gumede, K. (2017). Your move: The effect of chess on mathematics test scores. PLOS ONE, 12(5), e0177257.",
        detail: "In five Danish schools, 482 pupils aged about 6 to 9 had one weekly maths lesson replaced with chess. Maths scores rose slightly compared with other classes. Classes were not randomly assigned, so the result is suggestive.",
        url: "https://doi.org/10.1371/journal.pone.0177257",
        level: "game",
      },
      {
        citation: "Aciego, R., García, L., & Betancort, M. (2012). The benefits of chess for the intellectual and social-emotional enrichment in schoolchildren. The Spanish Journal of Psychology, 15(2), 551–559.",
        detail: "Compared 170 Spanish pupils aged 6 to 16 who chose chess as an after-school activity with 60 who chose football or basketball. The chess group showed greater gains on thinking and self-report measures. Because children chose their own activity, the groups may have differed to begin with.",
        url: "https://doi.org/10.5209/rev_sjop.2012.v15.n2.38866",
        level: "game",
      },
      {
        citation: "Ye, Y. (2025). Research on the application of chess teaching in the intellectual development of young children: Analysis of educational models and strategies. Frontiers in Psychology, 16.",
        detail: "A study of 400 children aged 5 to 6 in two Chinese kindergartens reported gains in attention, memory and patience after chess teaching. Children were not randomly assigned and there was no long-term follow-up, so we treat it as early evidence.",
        url: "https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1592247/full",
        level: "game",
      },
    ],
  },
  {
    id: 'puzzles-spatial-reasoning',
    title: 'Puzzles, Spatial Thinking and Reasoning',
    preview: 'Spatial skills can be practised. How far the benefits travel is less certain.',
    accent: '#4a7eb8',
    deep: '#2f5f96',
    story: [
      {
        label: 'What we wanted to know',
        body: [
          'Spatial thinking means picturing how shapes turn, fit together and move. Can children get better at it with practice, and does that help with anything beyond the puzzle in front of them?',
        ],
      },
      {
        label: 'What the studies show',
        body: [
          'There is solid evidence that spatial skills can be improved. A review of 217 training studies found that practice helps, and that the gains reach other spatial tasks. A UK team found that short spatial training with eight year olds improved the skills they practised and some of their maths, and a later review of 29 studies found a small average improvement in maths, larger when children used hands-on materials.',
          'Studies of puzzles and games themselves are fewer. Children aged 7 to 9 who played a mix of reasoning games, with an adult asking them to explain where they were stuck, improved on a reasoning test. And about an hour of a simple number board game helped five year olds with early number skills, with the gains still there nine weeks later.',
        ],
      },
      {
        label: 'What this means for how we teach',
        body: [
          'It supports offering a range of puzzles and building challenges, and asking children to explain their thinking when they get stuck. Different activities practise different things: in one study, eight year olds who did structured block building improved at mentally rotating shapes, while a group who played a word board game did not. That is one reason we vary the puzzles we use.',
        ],
      },
      {
        kind: 'caveat',
        label: 'But there is an important caveat',
        body: [
          'Most of this research is about spatial training in general, not about puzzle products, and the authors of the reasoning games study say they cannot vouch for any single product. In a study of 634 children aged 7 to 9, how often they did construction play was not related to their spatial or maths scores, which hints that how a child plays may matter more than how much. And one puzzle result says little about an individual child: scores on the Tower of Hanoi varied widely and were not consistent when children were retested.',
        ],
      },
    ],
    refs: [
      {
        citation: "Uttal, D. H., Meadow, N. G., Tipton, E., Hand, L. L., Alden, A. R., Warren, C., & Newcombe, N. S. (2013). The malleability of spatial skills: A meta-analysis of training studies. Psychological Bulletin, 139(2), 352–402.",
        detail: "Pooled 217 studies and found that spatial skills, such as picturing how shapes rotate and fit, improve with practice, and that the gains extend to other spatial tasks. The studies cover many kinds of training and many ages, not puzzle games specifically.",
        url: "https://doi.org/10.1037/a0028446",
        level: "related",
      },
      {
        citation: "Gilligan, K. A., Thomas, M. S. C., & Farran, E. K. (2020). First demonstration of effective spatial training for near transfer to spatial performance and far transfer to a range of mathematics skills at 8 years. Developmental Science, 23(4), e12909.",
        detail: "A UK research team worked with 250 eight-year-olds. Short spatial training improved the spatial skills practised and some maths skills. The training was a taught activity, not a commercial game.",
        url: "https://doi.org/10.1111/desc.12909",
        level: "related",
      },
      {
        citation: "Hawes, Z. C. K., Gilligan-Lee, K. A., & Mix, K. S. (2022). Effects of spatial training on mathematics performance: A meta-analysis. Developmental Psychology, 58(1).",
        detail: "Across 29 studies, spatial training gave a small average improvement in maths. The effect was larger with hands-on materials and when the maths was closely related to the spatial skill practised.",
        url: "https://doi.org/10.1037/dev0001281",
        level: "related",
      },
      {
        citation: "Mackey, A. P., Hill, S. S., Stone, S. I., & Bunge, S. A. (2011). Differential effects of reasoning and speed training in children. Developmental Science, 14(3), 582–590.",
        detail: "Children aged 7 to 9 in the United States played a mix of commercial reasoning games, including sliding-block and tangram puzzles, for two hours a week over eight weeks, with adults asking them to explain where they were stuck. Their scores on a reasoning test rose. It was a small study, the games were used together, and the authors say they cannot vouch for any single product.",
        url: "https://doi.org/10.1111/j.1467-7687.2010.01005.x",
        level: "game",
      },
      {
        citation: "Newman, S. D., Hansen, M. T., & Gutierrez, A. (2016). An fMRI study of the impact of block building and board games on spatial ability. Frontiers in Psychology, 7, 1278.",
        detail: "Eight-year-olds who did five sessions of structured block building improved at mentally rotating shapes. A comparison group who played a word board game did not. Different activities practise different things.",
        url: "https://doi.org/10.3389/fpsyg.2016.01278",
        level: "game",
      },
      {
        citation: "McDougal, E., Gilligan-Lee, K. A., Gilmore, C., & Farran, E. K. (2024). Construction play frequency and relations with spatial ability and mathematics performance. British Journal of Developmental Psychology.",
        detail: "Among 634 children aged 7 to 9, how often they did construction play was not related to their spatial or maths scores. How much a child plays may matter less than how they play.",
        url: "https://doi.org/10.1111/bjdp.12465",
        level: "related",
      },
      {
        citation: "Bishop, D. V. M., Aamodt-Leeper, G., Creswell, C., McGurk, R., & Skuse, D. H. (2001). Individual differences in cognitive planning on the Tower of Hanoi task: Neuropsychological maturity or measurement error? Journal of Child Psychology and Psychiatry, 42(4).",
        detail: "Gave the Tower of Hanoi puzzle to 238 children aged 7 to 15. Scores varied widely and were not consistent when children were retested. A child's result on one puzzle should not be read as a measure of their ability.",
        url: "https://doi.org/10.1111/1469-7610.00749",
        level: "game",
      },
      {
        citation: "Ramani, G. B., & Siegler, R. S. (2008). Promoting broad and stable improvements in low-income children's numerical knowledge through playing number board games. Child Development, 79(2), 375–394.",
        detail: "About an hour of playing a simple number track board game improved early number skills in American children aged around 5, and the gains were still there nine weeks later.",
        url: "https://doi.org/10.1111/j.1467-8624.2007.01131.x",
        level: "game",
      },
    ],
  },
  {
    id: 'board-games-thinking-skills',
    title: 'Board Games and Thinking Skills',
    preview: 'Do board games build thinking skills? There is promise, and plenty of caution.',
    accent: '#7a48c0',
    deep: '#5f32a0',
    story: [
      {
        label: 'The question',
        body: [
          'Board games ask children to remember rules, plan ahead and hold back an impulse. Does playing them strengthen those thinking skills, often called executive functions?',
        ],
      },
      {
        label: 'What researchers found',
        body: [
          'The most recent systematic review found some promising results, mainly for short-term memory. It concluded, though, that the evidence is not yet strong enough to recommend board games as a way of improving skills such as self-control and flexible thinking, and it warned against treating all board games as the same.',
          'Individual studies are more upbeat. Spanish trials with children aged 7 to 12, and with pupils aged 8 to 10 playing short games in maths lessons, saw improvements, including on some memory and maths measures. A wider review of activities that support these skills in children aged 4 to 12 found that the successful ones involved repeated practice and a gradually increasing level of challenge.',
        ],
      },
      {
        label: 'What this means for how we teach',
        body: [
          'We choose games that can be made gradually more challenging, and we come back to them regularly, rather than promising that any one game builds a particular skill.',
        ],
      },
      {
        kind: 'caveat',
        label: 'But there is an important caveat',
        body: [
          'Gains tend to stay close to what was practised. A review of 90 studies of children found that these skills can be improved in the short term, but there was no convincing evidence that the gains last. Reviews of memory training, and of cognitive training more widely, conclude that it does not reliably improve reading, arithmetic, reasoning or general thinking ability. Some of the board game studies were small or not randomised, and one was funded by organisations linked to the games industry.',
        ],
      },
    ],
    refs: [
      {
        citation: "Estrada-Plana, V., Vita-Barrull, N., March-Llanes, J., Bafalluy, A. B., Ayesa-Arriola, R., & Moya-Higueras, J. (2026). Can executive functions be improved by playing board games across the lifespan? A systematic review and meta-analysis. Applied Psychology: Health and Well-Being, 18(4), e70194.",
        detail: "The most recent review of board-game studies. It found some promising results, mainly for short-term memory, but concluded that the evidence is not yet strong enough to recommend board games as a way of improving skills such as self-control and flexible thinking. It also warns against treating all board games as the same.",
        url: "https://doi.org/10.1111/aphw.70194",
        level: "game",
      },
      {
        citation: "Moya-Higueras, J., Solé-Puiggené, M., Vita-Barrull, N., Estrada-Plana, V., Guzmán, N., Arias, S., et al. (2023). Just play cognitive modern board and card games, it's going to be good for your executive functions. Children, 10(9), 1492.",
        detail: "A Spanish trial with 68 children aged 7 to 12. Children improved over time whichever set of modern board games they played. The study was funded by organisations linked to the games industry.",
        url: "https://doi.org/10.3390/children10091492",
        level: "game",
      },
      {
        citation: "Estrada-Plana, V., Martínez-Escribano, A., Ros-Morente, A., Mayoral, M., Castro-Quintas, A., Vita-Barrull, N., et al. (2024). Benefits of playing at school: Filler board games improve visuospatial memory and mathematical skills. Brain Sciences, 14(7), 642.",
        detail: "In Spanish primary schools, 234 pupils aged 8 to 10 played short board games in maths lessons for eight weeks. Some memory and maths measures improved compared with ordinary lessons. Schools were not randomly assigned and teachers knew which group they were in.",
        url: "https://doi.org/10.3390/brainsci14070642",
        level: "game",
      },
      {
        citation: "Diamond, A., & Lee, K. (2011). Interventions shown to aid executive function development in children 4 to 12 years old. Science, 333(6045), 959–964.",
        detail: "Reviews activities found to help children's self-control, working memory and flexible thinking. The successful ones involved repeated practice and gradually increased the challenge.",
        url: "https://doi.org/10.1126/science.1204529",
        level: "related",
      },
      {
        citation: "Takacs, Z. K., & Kassai, R. (2019). The efficacy of different interventions to foster children's executive function skills: A series of meta-analyses. Psychological Bulletin, 145(7).",
        detail: "Pooled 90 studies of children up to 12. These skills can be improved in the short term, but there was no convincing evidence that the gains last.",
        url: "https://doi.org/10.1037/bul0000195",
        level: "related",
      },
      {
        citation: "Melby-Lervåg, M., Redick, T. S., & Hulme, C. (2016). Working memory training does not improve performance on measures of intelligence or other measures of \"far transfer\". Perspectives on Psychological Science, 11(4).",
        detail: "Memory training makes people better at similar memory tasks. It does not reliably improve reading, arithmetic or reasoning.",
        url: "https://doi.org/10.1177/1745691616635612",
        level: "related",
      },
      {
        citation: "Sala, G., & Gobet, F. (2019). Cognitive training does not enhance general cognition. Trends in Cognitive Sciences, 23(1), 9–20.",
        detail: "Brings together several large reviews and concludes that practising mentally demanding activities has minimal effect on general thinking ability.",
        url: "https://doi.org/10.1016/j.tics.2018.10.004",
        level: "related",
      },
    ],
  },
  {
    id: 'adults-guiding-play',
    title: 'How Adults Guide Play and Learning',
    preview: 'What difference does it make when an adult joins in, and how much help is the right amount?',
    accent: '#2d8c62',
    deep: '#1f6b4a',
    story: [
      {
        label: 'The question',
        body: [
          'When children play, should the adult step back, step in, or do something in between?',
        ],
      },
      {
        label: 'What researchers found',
        body: [
          'A University of Cambridge review of 39 studies with children aged 1 to 8 found that play guided by an adult did better than direct teaching for some early maths skills and for switching between tasks, and no differently for other outcomes.',
          'How the adult joins in seems to matter. Feedback that explains is more useful than feedback that only says right or wrong. Asking learners to explain their own reasoning improves what they learn. And children learned far more from the same number board game when asked to count on from their current square than when they counted from one.',
          'The ideas underneath this are old. Wood, Bruner and Ross described scaffolding in 1976, an adult supporting a child through a problem they could not yet solve alone, and Vygotsky argued that children learn best just beyond what they can already do, with support.',
        ],
      },
      {
        label: 'What this means for how we teach',
        body: [
          'This is why our sessions include questions, pauses and conversations about what just happened, and why the amount of help a child gets changes over time. The evidence on younger pupils suggests that being shown first can work better than trying first, so we give younger children more modelling before asking them to try alone.',
        ],
      },
      {
        kind: 'caveat',
        label: 'But there is an important caveat',
        body: [
          'A lot of this research comes from classrooms and older students rather than children playing games, and the studies of scaffolding itself are few, though positive. UK guidance rates teaching children to plan, monitor and review their own learning as high impact when done well, but advises teaching it alongside a specific task, because children find it hard to apply general thinking tips elsewhere.',
        ],
      },
    ],
    refs: [
      {
        citation: "Skene, K., O'Farrelly, C. M., Byrne, E. M., Kirby, N., Stevens, E. C., & Ramchandani, P. G. (2022). Can guidance during play enhance children's learning and development in educational contexts? A systematic review and meta-analysis. Child Development, 93(4).",
        detail: "A University of Cambridge review of 39 studies with children aged 1 to 8. Play guided by an adult did better than direct teaching for some early maths skills and for switching between tasks, and no differently for other outcomes.",
        url: "https://doi.org/10.1111/cdev.13730",
        level: "related",
      },
      {
        citation: "Quigley, A., Muijs, D., & Stringer, E. (2018). Metacognition and self-regulated learning: Guidance report. Education Endowment Foundation.",
        detail: "UK guidance on teaching pupils to plan, monitor and review their own learning. It rates the approach as high impact when done well, and advises teaching these strategies alongside a specific task because children find it hard to apply general thinking tips elsewhere.",
        url: "https://eric.ed.gov/?id=ED612285",
        level: "guidance",
      },
      {
        citation: "Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. Educational Psychology Review, 30.",
        detail: "Across 64 research reports, asking learners to explain their own reasoning improved what they learned. Most of the studies involved older students and school subjects.",
        url: "https://eric.ed.gov/?id=EJ1186664",
        level: "related",
      },
      {
        citation: "Sinha, T., & Kapur, M. (2021). When problem solving followed by instruction works: Evidence for productive failure. Review of Educational Research, 91(5), 761–798.",
        detail: "Letting learners attempt a problem before being taught helps on average. For younger pupils, roughly ages 7 to 11, being shown first worked better. This is why we give younger children more modelling before asking them to try alone.",
        url: "https://eric.ed.gov/?id=EJ1308129",
        level: "related",
      },
      {
        citation: "Laski, E. V., & Siegler, R. S. (2014). Learning from number board games: You learn what you encode. Developmental Psychology, 50(3).",
        detail: "Children learned far more from the same number board game when asked to count on from their current square than when they counted from one. How a game is played changes what is learned from it.",
        url: "https://doi.org/10.1037/a0034321",
        level: "game",
      },
      {
        citation: "van de Pol, J., Volman, M., & Beishuizen, J. (2010). Scaffolding in teacher–student interaction: A decade of research. Educational Psychology Review, 22.",
        detail: "Describes scaffolding as support matched to the learner, gradually withdrawn, with responsibility handed over. The few studies of its effectiveness are positive, and the authors call for more.",
        url: "https://eric.ed.gov/?id=EJ924182",
        level: "related",
      },
      {
        citation: "Wisniewski, B., Zierer, K., & Hattie, J. (2019). The power of feedback revisited: A meta-analysis of educational feedback research. Frontiers in Psychology, 10, 3087.",
        detail: "Feedback helps learning on average, and how much depends on the information it gives. Feedback that explains is more useful than feedback that only says right or wrong.",
        url: "https://doi.org/10.3389/fpsyg.2019.03087",
        level: "related",
      },
      {
        citation: "Wood, D., Bruner, J. S., & Ross, G. (1976). The role of tutoring in problem solving. Journal of Child Psychology and Psychiatry, 17(2), 89–100.",
        detail: "The paper that introduced the idea of scaffolding: an adult supporting a child through a problem they could not yet solve alone.",
        url: "https://doi.org/10.1111/j.1469-7610.1976.tb00381.x",
        level: "theory",
      },
      {
        citation: "Vygotsky, L. S. (1978). Mind in society: The development of higher psychological processes. Harvard University Press.",
        detail: "The source of the idea that children learn best just beyond what they can already do alone, with support.",
        level: "theory",
      },
    ],
  },
  {
    id: 'motivation-and-mistakes',
    title: 'Motivation, Relationships and Learning from Mistakes',
    preview: 'Choice, connection, and what happens when things do not go to plan.',
    accent: '#c05050',
    deep: '#9a3434',
    story: [
      {
        label: 'The question',
        body: ['What keeps a child trying, especially when something goes wrong?'],
      },
      {
        label: 'What researchers found',
        body: [
          'Across 41 studies, giving people a choice increased their motivation and effort, and the effect was stronger for children than for adults. A review of 99 studies found that pupils with warmer relationships with their teachers were more engaged and achieved slightly more. Self-determination theory, a widely used account of motivation, builds on the same ground: feeling capable, having some choice, and feeling connected to others.',
        ],
      },
      {
        label: 'What this means for how we teach',
        body: [
          'It is one reason children choose between activities in our sessions, and why we take time to get to know each child.',
        ],
      },
      {
        kind: 'caveat',
        label: 'But there is an important caveat',
        body: [
          'The findings about relationships are associations, so they do not prove that one causes the other. And teaching children that ability grows with effort had only weak effects on achievement overall. We encourage children to learn from mistakes because it is a constructive way to work, not because we claim it raises attainment.',
        ],
      },
    ],
    refs: [
      {
        citation: "Patall, E. A., Cooper, H., & Robinson, J. C. (2008). The effects of choice on intrinsic motivation and related outcomes: A meta-analysis of research findings. Psychological Bulletin, 134(2), 270–300.",
        detail: "Across 41 studies, giving people a choice increased their motivation and effort, and the effect was stronger for children than adults.",
        url: "https://doi.org/10.1037/0033-2909.134.2.270",
        level: "related",
      },
      {
        citation: "Roorda, D. L., Koomen, H. M. Y., Spilt, J. L., & Oort, F. J. (2011). The influence of affective teacher–student relationships on students' school engagement and achievement: A meta-analytic approach. Review of Educational Research, 81(4).",
        detail: "Across 99 studies, pupils with warmer relationships with their teachers were more engaged and achieved slightly more. These are associations, so they do not prove that one causes the other.",
        url: "https://eric.ed.gov/?id=EJ945905",
        level: "related",
      },
      {
        citation: "Sisk, V. F., Burgoyne, A. P., Sun, J., Butler, J. L., & Macnamara, B. N. (2018). To what extent and under which circumstances are growth mind-sets important to academic achievement? Two meta-analyses. Psychological Science, 29(4).",
        detail: "Teaching children that ability grows with effort had only weak effects on achievement overall. We encourage children to learn from mistakes because it is a constructive way to work, and we do not claim it raises attainment.",
        url: "https://doi.org/10.1177/0956797617739704",
        level: "related",
      },
      {
        citation: "Deci, E. L., & Ryan, R. M. (2000). The \"what\" and \"why\" of goal pursuits: Human needs and the self-determination of behavior. Psychological Inquiry, 11(4), 227–268.",
        detail: "A widely used theory of motivation built on three needs: feeling capable, having some choice and feeling connected to others.",
        level: "theory",
      },
    ],
  },
  {
    id: 'playing-with-others',
    title: 'Playing with Others and Talking About Ideas',
    preview: 'Cooperating, competing and talking things through together.',
    accent: '#b84880',
    deep: '#933664',
    story: [
      {
        label: 'The question',
        body: [
          'Does it matter whether children play with each other or against each other, and what changes when they are asked to talk through their thinking?',
        ],
      },
      {
        label: 'What researchers found',
        body: [
          'Among 70 American children aged 4 to 5, cooperative behaviour increased and aggression decreased during and after cooperative games. In a Swedish study of 65 children aged 4 to 6, cooperative and competitive board games led to the same amount of helpful behaviour afterwards, although the children enjoyed the cooperative versions more. In a study of 28 children with ADHD, cooperative board games reduced teasing, and some children showed more poor sportsmanship in competitive games.',
          'On the talking side, a trial in 76 English primary schools found that Year 5 pupils whose teachers were trained to build reasoning and discussion into lessons made about two months’ extra progress in English and science.',
        ],
      },
      {
        label: 'What this means for how we teach',
        body: [
          'We use both cooperative and competitive games, and we choose the format to suit the child. Talking about ideas, explaining a decision and listening to someone else’s, is part of every session.',
        ],
      },
      {
        kind: 'caveat',
        label: 'But there is an important caveat',
        body: [
          'The English trial was a whole-class teaching programme, not a games session. A large review of 213 school programmes found that social and emotional learning improved pupils’ social skills, behaviour and attainment, but those were structured programmes delivered over time, so the findings do not carry over to a single game about feelings. The game studies themselves are small, and two of the three involved children aged 4 to 6.',
        ],
      },
    ],
    refs: [
      {
        citation: "Bay-Hinitz, A. K., Peterson, R. F., & Quilitch, H. R. (1994). Cooperative games: A way to modify aggressive and cooperative behaviors in young children. Journal of Applied Behavior Analysis, 27(3), 435–446.",
        detail: "Among 70 American children aged 4 to 5, cooperative behaviour increased and aggression decreased during and after cooperative games.",
        url: "https://doi.org/10.1901/jaba.1994.27-435",
        level: "game",
      },
      {
        citation: "Eriksson, M., Kenward, B., Poom, L., & Stenberg, G. (2021). The behavioral effects of cooperative and competitive board games in preschoolers. Scandinavian Journal of Psychology, 62(3).",
        detail: "Among 65 Swedish children aged 4 to 6, cooperative and competitive board games led to the same amount of helpful behaviour afterwards. Children enjoyed the cooperative versions more.",
        url: "https://doi.org/10.1111/sjop.12708",
        level: "game",
      },
      {
        citation: "Jusko, M. L., Merrill, B. M., Sutton, E. R., Sikov, J., Edmondson, G., Hayes, T., et al. (2026). Examination of peer interactions during cooperative and competitive board games among children with attention-deficit/hyperactivity disorder on and off methylphenidate. Research on Child and Adolescent Psychopathology.",
        detail: "In a study of 28 children with ADHD, cooperative board games reduced teasing, and some children showed more poor sportsmanship in competitive games. This is one reason we choose the format to suit the child.",
        url: "https://doi.org/10.1007/s10802-026-01442-1",
        level: "game",
      },
      {
        citation: "Jay, T., Willis, B., Thomas, P., Taylor, R., Moore, N., et al. (2017). Dialogic Teaching: Evaluation report and executive summary. Education Endowment Foundation.",
        detail: "A trial in 76 English primary schools. Year 5 pupils whose teachers were trained to build reasoning and discussion into lessons made about two months' extra progress in English and science. This was a whole-class teaching programme, not a games session.",
        url: "https://eric.ed.gov/?id=ED581114",
        level: "related",
      },
      {
        citation: "Durlak, J. A., Weissberg, R. P., Dymnicki, A. B., Taylor, R. D., & Schellinger, K. B. (2011). The impact of enhancing students' social and emotional learning: A meta-analysis of school-based universal interventions. Child Development, 82(1), 405–432.",
        detail: "Across 213 taught school programmes, social and emotional learning improved pupils' social skills, behaviour and attainment. These were structured programmes delivered over time, so the findings do not carry over to an individual game about feelings.",
        url: "https://doi.org/10.1111/j.1467-8624.2010.01564.x",
        level: "related",
      },
    ],
  },
  {
    id: 'additional-needs',
    title: 'Additional Needs, Learning Difficulties, ADHD, Autism and Sensory Resources',
    preview: 'What does the evidence say about games and resources for children with different needs?',
    accent: '#2a8c88',
    deep: '#1c6b68',
    story: [
      {
        label: 'The question',
        body: [
          'Can games and sensory resources help children with learning difficulties, ADHD or autism? We looked carefully, and the honest answer is that the evidence is early and mixed.',
        ],
      },
      {
        label: 'What researchers found',
        body: [
          'Some small studies of chess and Go report encouraging results. In four German special schools, classes that swapped one weekly maths lesson for chess improved more at simple addition and counting. Parents of 44 Spanish children with ADHD rated their symptoms as lower after 11 weeks of chess training, and 17 Korean children had lower inattention ratings after 16 weeks of Go lessons.',
          'For autism, a trial in 98 schools in the north of England found that twelve weeks of collaborative brick building clubs led to a small improvement in teacher-rated social skills, which fell just short of statistical significance.',
        ],
      },
      {
        label: 'What this means for how we teach',
        body: [
          'We use games and resources to make sessions accessible and engaging, and we do not present them as treatment. We do not claim that any resource we use treats or improves sensory processing difficulties.',
        ],
      },
      {
        kind: 'caveat',
        label: 'But there is an important caveat',
        body: [
          'The two ADHD chess and Go studies were small and had no comparison group of children with ADHD who did not play, so we treat them as early signals, not proof. A large trial of sensory integration therapy for autistic children found no clinical benefit over usual care, although carers reported progress on individual goals, and in a study of 60 young children with ADHD, fidget spinners were linked with poorer attention. A review of eight studies on helping autistic pupils manage emotions at school found little research on approaches led by schools themselves.',
        ],
      },
    ],
    refs: [
      {
        citation: "Scholz, M., Niesch, H., Steffen, O., Ernst, B., Loeffler, M., et al. (2008). Impact of chess training on mathematics performance and concentration ability of children with learning disabilities. International Journal of Special Education, 23(3).",
        detail: "In four German special schools, classes that swapped one weekly maths lesson for chess improved more at simple addition and counting. Concentration and other calculation skills developed equally in both groups.",
        url: "https://eric.ed.gov/?id=EJ833690",
        level: "game",
      },
      {
        citation: "Blasco-Fontecilla, H., Gonzalez-Perez, M., Garcia-Lopez, R., Poza-Cano, B., Perez-Moreno, M. R., de Leon-Martinez, V., & Otero-Perez, J. (2016). Efficacy of chess training for the treatment of ADHD: A prospective, open label study. Revista de Psiquiatría y Salud Mental, 9(1).",
        detail: "Parents of 44 Spanish children with ADHD rated their symptoms as lower after 11 weeks of chess training. There was no comparison group, and the authors say the results should be interpreted with caution.",
        url: "https://doi.org/10.1016/j.rpsm.2015.02.003",
        level: "game",
      },
      {
        citation: "Kim, S. H., Han, D. H., Lee, Y. S., Kim, B.-N., Cheong, J. H., & Han, S. H. (2014). Baduk (the game of Go) improved cognitive function and brain activity in children with attention deficit hyperactivity disorder. Psychiatry Investigation, 11(2), 143–151.",
        detail: "Seventeen Korean children with ADHD had lower inattention ratings after 16 weeks of intensive Go lessons. The study was small and had no group of children with ADHD who did not play.",
        url: "https://doi.org/10.4306/pi.2014.11.2.143",
        level: "game",
      },
      {
        citation: "Wright, B., Kingsley, E., Cooper, C., Biggs, K., Bursnall, M., Wang, H.-I., et al. (2023). I-SOCIALISE: Results from a cluster randomised controlled trial investigating the social competence and isolation of children with autism taking part in LEGO® based therapy ('Play Brick Therapy') clubs in school environments. Autism, 27(8).",
        detail: "A trial in 98 schools in the north of England with 250 autistic pupils aged 7 to 15. Twelve weeks of collaborative brick-building clubs led to a small improvement in teacher-rated social skills, which fell just short of statistical significance.",
        url: "https://doi.org/10.1177/13623613231159699",
        level: "related",
      },
      {
        citation: "Randell, E., Wright, M., Milosevic, S., Gillespie, D., Brookes-Howell, L., Busse-Morris, M., et al. (2022). Sensory integration therapy for children with autism and sensory processing difficulties: The SenITA RCT. Health Technology Assessment, 26(29).",
        detail: "A trial in Wales and England with 138 autistic primary pupils. Sensory integration therapy showed no clinical benefit over usual care, although carers reported progress on individual goals. We do not claim that any resource we use treats or improves sensory processing difficulties.",
        url: "https://doi.org/10.3310/tqge0020",
        level: "related",
      },
      {
        citation: "Graziano, P. A., Garcia, A. M., & Landis, T. D. (2020). To fidget or not to fidget, that is the question: A systematic classroom evaluation of fidget spinners among young children with ADHD. Journal of Attention Disorders, 24(1).",
        detail: "Among 60 young American children with ADHD, using fidget spinners in class was linked with poorer attention.",
        url: "https://doi.org/10.1177/1087054718770009",
        level: "related",
      },
      {
        citation: "Bennett, J., Parsons, S., & Kovshoff, H. (2024). Developing the emotion regulation skills of autistic pupils in educational settings: A systematic literature review. Journal of Research in Special Educational Needs, 24(3), 475–491.",
        detail: "A review of eight studies on helping autistic pupils manage emotions at school. It found little research on approaches led by schools themselves and calls for more.",
        url: "https://doi.org/10.1111/1471-3802.12646",
        level: "guidance",
      },
    ],
  },
];

// Things we looked for and did not find. Shown at the foot of the page.
export const notFound = [
  "We have not found an independent, peer-reviewed study of any specific SmartGames product, or of the Junior Learning social skills games.",
  "Sensory Education is a retailer of other companies' products, and we have not found independent evaluations of the items it sells.",
  "We have not found controlled research on Xiangqi, Janggi, Quoridor, Quarto, Pylos or Qawale with children.",
  "Most of the research involves children aged 4 to 10. Evidence for ages 11 and over is thin.",
  "No study has tested our own combination of games, questioning and reflection.",
];
