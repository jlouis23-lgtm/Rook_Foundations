import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import { usePageMeta } from '@/hooks/use-page-meta';

// Evidence labels shown beside each reference:
//   game     — the study tested this kind of game directly
//   related  — research on a comparable activity or the underlying skill
//   guidance — an evidence review or guidance report
//   theory   — a foundational idea, not a test of games
const evidenceLabels = {
  game: 'Studied this kind of game',
  related: 'Related research',
  guidance: 'Evidence review',
  theory: 'Theory',
};

const sections = [
  {
    topic: "Chess and School Results",
    emoji: "♟️",
    accent: "#b8790a",
    refs: [
      {
        citation: "Jerrim, J., Macmillan, L., Micklewright, J., Sawtell, M., & Wiggins, M. (2016). Chess in Schools: Evaluation report and executive summary. Education Endowment Foundation.",
        detail: "The largest UK trial of chess teaching: 100 primary schools in England and 4,009 Year 5 pupils, with schools randomly chosen to receive 30 hours of chess lessons. One year later there was no difference in maths, reading or science results. Half of the pupils said they liked the lessons a lot, and teachers were positive about them.",
        url: "https://eric.ed.gov/?id=ED581100",
        level: 'game',
      },
      {
        citation: "Sala, G., & Gobet, F. (2016). Do the benefits of chess instruction transfer to academic and cognitive skills? A meta-analysis. Educational Research Review, 18, 46–57.",
        detail: "Pooled 24 studies of chess teaching and found a small to moderate average benefit. The authors warn that most of the studies did not compare chess with another engaging activity, so the benefit may not be down to chess itself.",
        url: "https://doi.org/10.1016/j.edurev.2016.02.002",
        level: 'game',
      },
      {
        citation: "Sala, G., & Gobet, F. (2017). Does chess instruction improve mathematical problem-solving ability? Two experimental studies with an active control group. Learning & Behavior, 45.",
        detail: "Two experiments with pupils aged about 8 to 10 compared chess with another board game and with no extra activity. There was no significant difference in maths problem solving between the groups.",
        url: "https://doi.org/10.3758/s13420-017-0280-3",
        level: 'game',
      },
      {
        citation: "Sala, G., & Gobet, F. (2017). Does far transfer exist? Negative evidence from chess, music, and working memory training. Current Directions in Psychological Science, 26(6).",
        detail: "Reviews chess, music and memory training together. The better designed a study was, the smaller the benefit it found. The authors conclude that skills learned in one area rarely carry over to unrelated areas.",
        url: "https://doi.org/10.1177/0963721417712760",
        level: 'game',
      },
      {
        citation: "Rosholm, M., Mikkelsen, M. B., & Gumede, K. (2017). Your move: The effect of chess on mathematics test scores. PLOS ONE, 12(5), e0177257.",
        detail: "In five Danish schools, 482 pupils aged about 6 to 9 had one weekly maths lesson replaced with chess. Maths scores rose slightly compared with other classes. Classes were not randomly assigned, so the result is suggestive.",
        url: "https://doi.org/10.1371/journal.pone.0177257",
        level: 'game',
      },
      {
        citation: "Aciego, R., García, L., & Betancort, M. (2012). The benefits of chess for the intellectual and social-emotional enrichment in schoolchildren. The Spanish Journal of Psychology, 15(2), 551–559.",
        detail: "Compared 170 Spanish pupils aged 6 to 16 who chose chess as an after-school activity with 60 who chose football or basketball. The chess group showed greater gains on thinking and self-report measures. Because children chose their own activity, the groups may have differed to begin with.",
        url: "https://doi.org/10.5209/rev_sjop.2012.v15.n2.38866",
        level: 'game',
      },
      {
        citation: "Ye, Y. (2025). Research on the application of chess teaching in the intellectual development of young children: Analysis of educational models and strategies. Frontiers in Psychology, 16.",
        detail: "A study of 400 children aged 5 to 6 in two Chinese kindergartens reported gains in attention, memory and patience after chess teaching. Children were not randomly assigned and there was no long-term follow-up, so we treat it as early evidence.",
        url: "https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1592247/full",
        level: 'game',
      },
    ],
  },
  {
    topic: "Puzzles, Spatial Thinking and Reasoning Games",
    emoji: "🧩",
    accent: "#4a7eb8",
    refs: [
      {
        citation: "Uttal, D. H., Meadow, N. G., Tipton, E., Hand, L. L., Alden, A. R., Warren, C., & Newcombe, N. S. (2013). The malleability of spatial skills: A meta-analysis of training studies. Psychological Bulletin, 139(2), 352–402.",
        detail: "Pooled 217 studies and found that spatial skills, such as picturing how shapes rotate and fit, improve with practice, and that the gains extend to other spatial tasks. The studies cover many kinds of training and many ages, not puzzle games specifically.",
        url: "https://doi.org/10.1037/a0028446",
        level: 'related',
      },
      {
        citation: "Gilligan, K. A., Thomas, M. S. C., & Farran, E. K. (2020). First demonstration of effective spatial training for near transfer to spatial performance and far transfer to a range of mathematics skills at 8 years. Developmental Science, 23(4), e12909.",
        detail: "A UK research team worked with 250 eight-year-olds. Short spatial training improved the spatial skills practised and some maths skills. The training was a taught activity, not a commercial game.",
        url: "https://doi.org/10.1111/desc.12909",
        level: 'related',
      },
      {
        citation: "Hawes, Z. C. K., Gilligan-Lee, K. A., & Mix, K. S. (2022). Effects of spatial training on mathematics performance: A meta-analysis. Developmental Psychology, 58(1).",
        detail: "Across 29 studies, spatial training gave a small average improvement in maths. The effect was larger with hands-on materials and when the maths was closely related to the spatial skill practised.",
        url: "https://doi.org/10.1037/dev0001281",
        level: 'related',
      },
      {
        citation: "Mackey, A. P., Hill, S. S., Stone, S. I., & Bunge, S. A. (2011). Differential effects of reasoning and speed training in children. Developmental Science, 14(3), 582–590.",
        detail: "Children aged 7 to 9 in the United States played a mix of commercial reasoning games, including sliding-block and tangram puzzles, for two hours a week over eight weeks, with adults asking them to explain where they were stuck. Their scores on a reasoning test rose. It was a small study, the games were used together, and the authors say they cannot vouch for any single product.",
        url: "https://doi.org/10.1111/j.1467-7687.2010.01005.x",
        level: 'game',
      },
      {
        citation: "Newman, S. D., Hansen, M. T., & Gutierrez, A. (2016). An fMRI study of the impact of block building and board games on spatial ability. Frontiers in Psychology, 7, 1278.",
        detail: "Eight-year-olds who did five sessions of structured block building improved at mentally rotating shapes. A comparison group who played a word board game did not. Different activities practise different things.",
        url: "https://doi.org/10.3389/fpsyg.2016.01278",
        level: 'game',
      },
      {
        citation: "McDougal, E., Gilligan-Lee, K. A., Gilmore, C., & Farran, E. K. (2024). Construction play frequency and relations with spatial ability and mathematics performance. British Journal of Developmental Psychology.",
        detail: "Among 634 children aged 7 to 9, how often they did construction play was not related to their spatial or maths scores. How much a child plays may matter less than how they play.",
        url: "https://doi.org/10.1111/bjdp.12465",
        level: 'related',
      },
      {
        citation: "Bishop, D. V. M., Aamodt-Leeper, G., Creswell, C., McGurk, R., & Skuse, D. H. (2001). Individual differences in cognitive planning on the Tower of Hanoi task: Neuropsychological maturity or measurement error? Journal of Child Psychology and Psychiatry, 42(4).",
        detail: "Gave the Tower of Hanoi puzzle to 238 children aged 7 to 15. Scores varied widely and were not consistent when children were retested. A child's result on one puzzle should not be read as a measure of their ability.",
        url: "https://doi.org/10.1111/1469-7610.00749",
        level: 'game',
      },
      {
        citation: "Ramani, G. B., & Siegler, R. S. (2008). Promoting broad and stable improvements in low-income children's numerical knowledge through playing number board games. Child Development, 79(2), 375–394.",
        detail: "About an hour of playing a simple number track board game improved early number skills in American children aged around 5, and the gains were still there nine weeks later.",
        url: "https://doi.org/10.1111/j.1467-8624.2007.01131.x",
        level: 'game',
      },
    ],
  },
  {
    topic: "Board Games and Thinking Skills",
    emoji: "🎲",
    accent: "#7a48c0",
    refs: [
      {
        citation: "Estrada-Plana, V., Vita-Barrull, N., March-Llanes, J., Bafalluy, A. B., Ayesa-Arriola, R., & Moya-Higueras, J. (2026). Can executive functions be improved by playing board games across the lifespan? A systematic review and meta-analysis. Applied Psychology: Health and Well-Being, 18(4), e70194.",
        detail: "The most recent review of board-game studies. It found some promising results, mainly for short-term memory, but concluded that the evidence is not yet strong enough to recommend board games as a way of improving skills such as self-control and flexible thinking. It also warns against treating all board games as the same.",
        url: "https://doi.org/10.1111/aphw.70194",
        level: 'game',
      },
      {
        citation: "Moya-Higueras, J., Solé-Puiggené, M., Vita-Barrull, N., Estrada-Plana, V., Guzmán, N., Arias, S., et al. (2023). Just play cognitive modern board and card games, it's going to be good for your executive functions. Children, 10(9), 1492.",
        detail: "A Spanish trial with 68 children aged 7 to 12. Children improved over time whichever set of modern board games they played. The study was funded by organisations linked to the games industry.",
        url: "https://doi.org/10.3390/children10091492",
        level: 'game',
      },
      {
        citation: "Estrada-Plana, V., Martínez-Escribano, A., Ros-Morente, A., Mayoral, M., Castro-Quintas, A., Vita-Barrull, N., et al. (2024). Benefits of playing at school: Filler board games improve visuospatial memory and mathematical skills. Brain Sciences, 14(7), 642.",
        detail: "In Spanish primary schools, 234 pupils aged 8 to 10 played short board games in maths lessons for eight weeks. Some memory and maths measures improved compared with ordinary lessons. Schools were not randomly assigned and teachers knew which group they were in.",
        url: "https://doi.org/10.3390/brainsci14070642",
        level: 'game',
      },
      {
        citation: "Diamond, A., & Lee, K. (2011). Interventions shown to aid executive function development in children 4 to 12 years old. Science, 333(6045), 959–964.",
        detail: "Reviews activities found to help children's self-control, working memory and flexible thinking. The successful ones involved repeated practice and gradually increased the challenge.",
        url: "https://doi.org/10.1126/science.1204529",
        level: 'related',
      },
      {
        citation: "Takacs, Z. K., & Kassai, R. (2019). The efficacy of different interventions to foster children's executive function skills: A series of meta-analyses. Psychological Bulletin, 145(7).",
        detail: "Pooled 90 studies of children up to 12. These skills can be improved in the short term, but there was no convincing evidence that the gains last.",
        url: "https://doi.org/10.1037/bul0000195",
        level: 'related',
      },
      {
        citation: "Melby-Lervåg, M., Redick, T. S., & Hulme, C. (2016). Working memory training does not improve performance on measures of intelligence or other measures of \"far transfer\". Perspectives on Psychological Science, 11(4).",
        detail: "Memory training makes people better at similar memory tasks. It does not reliably improve reading, arithmetic or reasoning.",
        url: "https://doi.org/10.1177/1745691616635612",
        level: 'related',
      },
      {
        citation: "Sala, G., & Gobet, F. (2019). Cognitive training does not enhance general cognition. Trends in Cognitive Sciences, 23(1), 9–20.",
        detail: "Brings together several large reviews and concludes that practising mentally demanding activities has minimal effect on general thinking ability.",
        url: "https://doi.org/10.1016/j.tics.2018.10.004",
        level: 'related',
      },
    ],
  },
  {
    topic: "How Adults Guide Play and Learning",
    emoji: "🧭",
    accent: "#2d8c62",
    refs: [
      {
        citation: "Skene, K., O'Farrelly, C. M., Byrne, E. M., Kirby, N., Stevens, E. C., & Ramchandani, P. G. (2022). Can guidance during play enhance children's learning and development in educational contexts? A systematic review and meta-analysis. Child Development, 93(4).",
        detail: "A University of Cambridge review of 39 studies with children aged 1 to 8. Play guided by an adult did better than direct teaching for some early maths skills and for switching between tasks, and no differently for other outcomes.",
        url: "https://doi.org/10.1111/cdev.13730",
        level: 'related',
      },
      {
        citation: "Quigley, A., Muijs, D., & Stringer, E. (2018). Metacognition and self-regulated learning: Guidance report. Education Endowment Foundation.",
        detail: "UK guidance on teaching pupils to plan, monitor and review their own learning. It rates the approach as high impact when done well, and advises teaching these strategies alongside a specific task because children find it hard to apply general thinking tips elsewhere.",
        url: "https://eric.ed.gov/?id=ED612285",
        level: 'guidance',
      },
      {
        citation: "Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. Educational Psychology Review, 30.",
        detail: "Across 64 research reports, asking learners to explain their own reasoning improved what they learned. Most of the studies involved older students and school subjects.",
        url: "https://eric.ed.gov/?id=EJ1186664",
        level: 'related',
      },
      {
        citation: "Sinha, T., & Kapur, M. (2021). When problem solving followed by instruction works: Evidence for productive failure. Review of Educational Research, 91(5), 761–798.",
        detail: "Letting learners attempt a problem before being taught helps on average. For younger pupils, roughly ages 7 to 11, being shown first worked better. This is why we give younger children more modelling before asking them to try alone.",
        url: "https://eric.ed.gov/?id=EJ1308129",
        level: 'related',
      },
      {
        citation: "Laski, E. V., & Siegler, R. S. (2014). Learning from number board games: You learn what you encode. Developmental Psychology, 50(3).",
        detail: "Children learned far more from the same number board game when asked to count on from their current square than when they counted from one. How a game is played changes what is learned from it.",
        url: "https://doi.org/10.1037/a0034321",
        level: 'game',
      },
      {
        citation: "van de Pol, J., Volman, M., & Beishuizen, J. (2010). Scaffolding in teacher–student interaction: A decade of research. Educational Psychology Review, 22.",
        detail: "Describes scaffolding as support matched to the learner, gradually withdrawn, with responsibility handed over. The few studies of its effectiveness are positive, and the authors call for more.",
        url: "https://eric.ed.gov/?id=EJ924182",
        level: 'related',
      },
      {
        citation: "Wisniewski, B., Zierer, K., & Hattie, J. (2019). The power of feedback revisited: A meta-analysis of educational feedback research. Frontiers in Psychology, 10, 3087.",
        detail: "Feedback helps learning on average, and how much depends on the information it gives. Feedback that explains is more useful than feedback that only says right or wrong.",
        url: "https://doi.org/10.3389/fpsyg.2019.03087",
        level: 'related',
      },
      {
        citation: "Wood, D., Bruner, J. S., & Ross, G. (1976). The role of tutoring in problem solving. Journal of Child Psychology and Psychiatry, 17(2), 89–100.",
        detail: "The paper that introduced the idea of scaffolding: an adult supporting a child through a problem they could not yet solve alone.",
        url: "https://doi.org/10.1111/j.1469-7610.1976.tb00381.x",
        level: 'theory',
      },
      {
        citation: "Vygotsky, L. S. (1978). Mind in society: The development of higher psychological processes. Harvard University Press.",
        detail: "The source of the idea that children learn best just beyond what they can already do alone, with support.",
        level: 'theory',
      },
    ],
  },
  {
    topic: "Motivation, Relationships and Learning from Mistakes",
    emoji: "🌱",
    accent: "#2d8c62",
    refs: [
      {
        citation: "Patall, E. A., Cooper, H., & Robinson, J. C. (2008). The effects of choice on intrinsic motivation and related outcomes: A meta-analysis of research findings. Psychological Bulletin, 134(2), 270–300.",
        detail: "Across 41 studies, giving people a choice increased their motivation and effort, and the effect was stronger for children than adults.",
        url: "https://doi.org/10.1037/0033-2909.134.2.270",
        level: 'related',
      },
      {
        citation: "Roorda, D. L., Koomen, H. M. Y., Spilt, J. L., & Oort, F. J. (2011). The influence of affective teacher–student relationships on students' school engagement and achievement: A meta-analytic approach. Review of Educational Research, 81(4).",
        detail: "Across 99 studies, pupils with warmer relationships with their teachers were more engaged and achieved slightly more. These are associations, so they do not prove that one causes the other.",
        url: "https://eric.ed.gov/?id=EJ945905",
        level: 'related',
      },
      {
        citation: "Sisk, V. F., Burgoyne, A. P., Sun, J., Butler, J. L., & Macnamara, B. N. (2018). To what extent and under which circumstances are growth mind-sets important to academic achievement? Two meta-analyses. Psychological Science, 29(4).",
        detail: "Teaching children that ability grows with effort had only weak effects on achievement overall. We encourage children to learn from mistakes because it is a constructive way to work, and we do not claim it raises attainment.",
        url: "https://doi.org/10.1177/0956797617739704",
        level: 'related',
      },
      {
        citation: "Deci, E. L., & Ryan, R. M. (2000). The \"what\" and \"why\" of goal pursuits: Human needs and the self-determination of behavior. Psychological Inquiry, 11(4), 227–268.",
        detail: "A widely used theory of motivation built on three needs: feeling capable, having some choice and feeling connected to others.",
        level: 'theory',
      },
    ],
  },
  {
    topic: "Playing with Others and Talking About Ideas",
    emoji: "🤝",
    accent: "#b84880",
    refs: [
      {
        citation: "Bay-Hinitz, A. K., Peterson, R. F., & Quilitch, H. R. (1994). Cooperative games: A way to modify aggressive and cooperative behaviors in young children. Journal of Applied Behavior Analysis, 27(3), 435–446.",
        detail: "Among 70 American children aged 4 to 5, cooperative behaviour increased and aggression decreased during and after cooperative games.",
        url: "https://doi.org/10.1901/jaba.1994.27-435",
        level: 'game',
      },
      {
        citation: "Eriksson, M., Kenward, B., Poom, L., & Stenberg, G. (2021). The behavioral effects of cooperative and competitive board games in preschoolers. Scandinavian Journal of Psychology, 62(3).",
        detail: "Among 65 Swedish children aged 4 to 6, cooperative and competitive board games led to the same amount of helpful behaviour afterwards. Children enjoyed the cooperative versions more.",
        url: "https://doi.org/10.1111/sjop.12708",
        level: 'game',
      },
      {
        citation: "Jusko, M. L., Merrill, B. M., Sutton, E. R., Sikov, J., Edmondson, G., Hayes, T., et al. (2026). Examination of peer interactions during cooperative and competitive board games among children with attention-deficit/hyperactivity disorder on and off methylphenidate. Research on Child and Adolescent Psychopathology.",
        detail: "In a study of 28 children with ADHD, cooperative board games reduced teasing, and some children showed more poor sportsmanship in competitive games. This is one reason we choose the format to suit the child.",
        url: "https://doi.org/10.1007/s10802-026-01442-1",
        level: 'game',
      },
      {
        citation: "Jay, T., Willis, B., Thomas, P., Taylor, R., Moore, N., et al. (2017). Dialogic Teaching: Evaluation report and executive summary. Education Endowment Foundation.",
        detail: "A trial in 76 English primary schools. Year 5 pupils whose teachers were trained to build reasoning and discussion into lessons made about two months' extra progress in English and science. This was a whole-class teaching programme, not a games session.",
        url: "https://eric.ed.gov/?id=ED581114",
        level: 'related',
      },
      {
        citation: "Durlak, J. A., Weissberg, R. P., Dymnicki, A. B., Taylor, R. D., & Schellinger, K. B. (2011). The impact of enhancing students' social and emotional learning: A meta-analysis of school-based universal interventions. Child Development, 82(1), 405–432.",
        detail: "Across 213 taught school programmes, social and emotional learning improved pupils' social skills, behaviour and attainment. These were structured programmes delivered over time, so the findings do not carry over to an individual game about feelings.",
        url: "https://doi.org/10.1111/j.1467-8624.2010.01564.x",
        level: 'related',
      },
    ],
  },
  {
    topic: "Additional Needs: Learning Difficulties, ADHD, Autism and Sensory Resources",
    emoji: "📚",
    accent: "#4a7eb8",
    refs: [
      {
        citation: "Scholz, M., Niesch, H., Steffen, O., Ernst, B., Loeffler, M., et al. (2008). Impact of chess training on mathematics performance and concentration ability of children with learning disabilities. International Journal of Special Education, 23(3).",
        detail: "In four German special schools, classes that swapped one weekly maths lesson for chess improved more at simple addition and counting. Concentration and other calculation skills developed equally in both groups.",
        url: "https://eric.ed.gov/?id=EJ833690",
        level: 'game',
      },
      {
        citation: "Blasco-Fontecilla, H., Gonzalez-Perez, M., Garcia-Lopez, R., Poza-Cano, B., Perez-Moreno, M. R., de Leon-Martinez, V., & Otero-Perez, J. (2016). Efficacy of chess training for the treatment of ADHD: A prospective, open label study. Revista de Psiquiatría y Salud Mental, 9(1).",
        detail: "Parents of 44 Spanish children with ADHD rated their symptoms as lower after 11 weeks of chess training. There was no comparison group, and the authors say the results should be interpreted with caution.",
        url: "https://doi.org/10.1016/j.rpsm.2015.02.003",
        level: 'game',
      },
      {
        citation: "Kim, S. H., Han, D. H., Lee, Y. S., Kim, B.-N., Cheong, J. H., & Han, S. H. (2014). Baduk (the game of Go) improved cognitive function and brain activity in children with attention deficit hyperactivity disorder. Psychiatry Investigation, 11(2), 143–151.",
        detail: "Seventeen Korean children with ADHD had lower inattention ratings after 16 weeks of intensive Go lessons. The study was small and had no group of children with ADHD who did not play.",
        url: "https://doi.org/10.4306/pi.2014.11.2.143",
        level: 'game',
      },
      {
        citation: "Wright, B., Kingsley, E., Cooper, C., Biggs, K., Bursnall, M., Wang, H.-I., et al. (2023). I-SOCIALISE: Results from a cluster randomised controlled trial investigating the social competence and isolation of children with autism taking part in LEGO® based therapy ('Play Brick Therapy') clubs in school environments. Autism, 27(8).",
        detail: "A trial in 98 schools in the north of England with 250 autistic pupils aged 7 to 15. Twelve weeks of collaborative brick-building clubs led to a small improvement in teacher-rated social skills, which fell just short of statistical significance.",
        url: "https://doi.org/10.1177/13623613231159699",
        level: 'related',
      },
      {
        citation: "Randell, E., Wright, M., Milosevic, S., Gillespie, D., Brookes-Howell, L., Busse-Morris, M., et al. (2022). Sensory integration therapy for children with autism and sensory processing difficulties: The SenITA RCT. Health Technology Assessment, 26(29).",
        detail: "A trial in Wales and England with 138 autistic primary pupils. Sensory integration therapy showed no clinical benefit over usual care, although carers reported progress on individual goals. We do not claim that any resource we use treats or improves sensory processing difficulties.",
        url: "https://doi.org/10.3310/tqge0020",
        level: 'related',
      },
      {
        citation: "Graziano, P. A., Garcia, A. M., & Landis, T. D. (2020). To fidget or not to fidget, that is the question: A systematic classroom evaluation of fidget spinners among young children with ADHD. Journal of Attention Disorders, 24(1).",
        detail: "Among 60 young American children with ADHD, using fidget spinners in class was linked with poorer attention.",
        url: "https://doi.org/10.1177/1087054718770009",
        level: 'related',
      },
      {
        citation: "Bennett, J., Parsons, S., & Kovshoff, H. (2024). Developing the emotion regulation skills of autistic pupils in educational settings: A systematic literature review. Journal of Research in Special Educational Needs, 24(3), 475–491.",
        detail: "A review of eight studies on helping autistic pupils manage emotions at school. It found little research on approaches led by schools themselves and calls for more.",
        url: "https://doi.org/10.1111/1471-3802.12646",
        level: 'guidance',
      },
    ],
  },
];

const notFound = [
  "We have not found an independent, peer-reviewed study of any specific SmartGames product, or of the Junior Learning social skills games.",
  "Sensory Education is a retailer of other companies' products, and we have not found independent evaluations of the items it sells.",
  "We have not found controlled research on Xiangqi, Janggi, Quoridor, Quarto, Pylos or Qawale with children.",
  "Most of the research involves children aged 4 to 10. Evidence for ages 11 and over is thin.",
  "No study has tested our own combination of games, questioning and reflection.",
];

export default function References() {
  usePageMeta(
    'The Research Behind Our Approach | Rook Foundations',
    'The studies behind the Rook Foundations approach, organised by topic, with what each one found, who took part and where the evidence is limited.'
  );
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-32 pb-24">
      {/* Header */}
      <section className="relative overflow-hidden py-16">
        <ChessBg variant="references" />

        <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 font-nunito text-[#2D2520]/45 text-sm font-600 hover:text-[#E8A020] transition-colors mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>
          <span className="inline-flex items-center gap-1.5 font-nunito text-amber-700 text-sm font-800 uppercase tracking-widest mb-5">
            <BookOpen size={14} /> Research & evidence
          </span>
          <h1 className="font-fredoka text-[#2D2520] mb-4" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
            The research behind our approach
          </h1>
          <p className="font-nunito text-[#2D2520]/60 text-lg leading-relaxed max-w-2xl">
            We believe families and schools deserve to know what informs our teaching, including where the evidence is weak. Below are the studies we draw on, organised by topic, with what each one found and who took part.
          </p>
          <div className="mt-6 border-l-4 border-amber-300 pl-5 max-w-2xl">
            <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">
              <span className="font-700 text-[#b8790a]">How to read this page:</span> each reference carries a label. "Studied this kind of game" means the research tested a game or puzzle directly. "Related research" means it studied a comparable activity or an underlying skill, so it can explain why a game might be useful but cannot show that a particular game works. Describing a product as educational is not the same as showing that it is, so we separate the two.
            </p>
          </div>
        </div>
      </section>

      {/* Reference sections */}
      <section className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="border-t border-[#2D2520]/10 divide-y divide-[#2D2520]/10">
          {sections.map((section, si) => (
            <motion.div
              key={si}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: si * 0.05 }}
              className="py-10"
            >
              {/* Section header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{section.emoji}</span>
                <h2 className="font-fredoka text-xl" style={{ color: section.accent }}>{section.topic}</h2>
              </div>

              {/* References */}
              <div className="space-y-5">
                {section.refs.map((ref, ri) => (
                  <div key={ri} className="flex gap-4">
                    <div className="w-1.5 rounded-full flex-shrink-0 mt-1"
                      style={{ backgroundColor: `${section.accent}40`, minHeight: '2rem' }} />
                    <div>
                      <span
                        className="inline-block font-nunito text-[11px] font-700 uppercase tracking-wide px-2.5 py-0.5 rounded-full mb-2"
                        style={{ backgroundColor: `${section.accent}14`, color: section.accent }}
                      >
                        {evidenceLabels[ref.level]}
                      </span>
                      <p className="font-nunito text-[#2D2520] text-sm font-700 leading-snug mb-1">
                        {ref.citation}
                      </p>
                      <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">
                        {ref.detail}
                      </p>
                      {ref.url && (
                        <a href={ref.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 font-nunito text-xs font-700 hover:underline transition-colors"
                          style={{ color: section.accent }}>
                          Read the source →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* What we have not found */}
        <div className="mt-4 bg-white border border-[#2D2520]/10 rounded-2xl p-6 sm:p-8">
          <h2 className="font-fredoka text-xl text-[#2D2520] mb-4">What we have not found</h2>
          <ul className="space-y-2.5">
            {notFound.map((item) => (
              <li key={item} className="flex items-start gap-3 font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8A020] flex-shrink-0 mt-2" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <p className="font-nunito text-[#2D2520]/50 text-xs leading-relaxed mt-5">
            Last reviewed October 2026. If you know of research we have missed, please tell us.
          </p>
        </div>

        {/* Footer CTA */}
        <div className="mt-14 text-center">
          <p className="font-nunito text-[#2D2520]/45 text-sm font-600 mb-5">
            Have a question about any of these sources, or want to learn more?
          </p>
          <Link
            to="/contact"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 bg-[#E8A020] text-white font-fredoka font-600 text-base px-8 py-3.5 rounded-2xl hover:bg-[#d4940e] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#E8A020]/25"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}