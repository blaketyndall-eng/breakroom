/**
 * Employee Quiz — the foundational OmniShift intake quiz.
 *
 * Optional, gates nothing. New users land at /portal with a provisional
 * profile auto-seeded from their user id; this quiz refines that profile
 * once the user opts in to refining.
 *
 * 10 questions, 6 options each. Every option carries 2–3 stat deltas in
 * the universal AIM/NERVE/WIT/CHARM/COOL/HEART/LUCK/TASTE space.
 * Every question is skippable; engine.fillUnansweredDeterministic
 * backfills on Finalize so users can stop at any point and still
 * produce a coherent assignment.
 *
 * Question prompts and option text use canonical Breakroom vocabulary
 * (clock counter, fluorescent buzz, motel sign, hotline poster, etc.)
 * so the quiz reads like the room recognizing you, not a survey.
 */

import type { Quiz } from '../../engine';

export const EMPLOYEE_QUIZ: Quiz = {
  slug: 'employee-intake',
  kind: 'foundational',
  world: 'omnishift',
  title: 'EMPLOYEE INTAKE / SHIFT 1',
  shortTitle: 'EMPLOYEE INTAKE',
  blurb: 'OmniShift would like to file you. Optional. Skippable. Used for assignment.',
  toneColor: '#1d2891', // OmniShift institutional indigo
  questions: [
    {
      id: 'q1',
      prompt: "It's 1:47 a.m. What sound is most familiar?",
      options: [
        { id: 'a', text: 'COIN COUNTER CLICKING.',                   stats: { cool: 2, wit: 1 } },
        { id: 'b', text: 'FLUORESCENT BUZZ.',                        stats: { wit: 2, nerve: 1 } },
        { id: 'c', text: 'ENGINE IDLING.',                           stats: { cool: 2, nerve: 1 } },
        { id: 'd', text: 'ICE MACHINE REFILLING.',                   stats: { luck: 2, wit: 1 } },
        { id: 'e', text: "LOCK TURNING THAT WASN'T YOURS.",          stats: { nerve: 2, wit: 1 } },
        { id: 'f', text: "HOLD MUSIC IN SOMEONE ELSE'S OFFICE.",     stats: { charm: 2, wit: 1 } },
      ],
    },
    {
      id: 'q2',
      prompt: 'Choose a wrong door.',
      options: [
        { id: 'a', text: 'THE ONE WITHOUT A HANDLE.',                stats: { wit: 2, nerve: 1 } },
        { id: 'b', text: 'THE ONE LABELED "THIS DOOR ONLY".',         stats: { nerve: 2, luck: 1 } },
        { id: 'c', text: 'THE ONE TOO NARROW FOR A COAT.',           stats: { heart: 2, taste: 1 } },
        { id: 'd', text: 'THE ONE PAINTED SHUT.',                    stats: { heart: 2, nerve: 1 } },
        { id: 'e', text: 'THE ONE THAT OPENS BY ACCIDENT.',          stats: { luck: 2, cool: 1 } },
        { id: 'f', text: 'NONE. THEY ARE ALL WRONG.',                stats: { wit: 2, cool: 1 } },
      ],
    },
    {
      id: 'q3',
      prompt: 'A meeting is scheduled. Attendance is mandatory. The room is empty.',
      options: [
        { id: 'a', text: 'YOU WAIT.',                                stats: { cool: 2, wit: 1 } },
        { id: 'b', text: 'YOU LEAVE.',                               stats: { nerve: 2, cool: 1 } },
        { id: 'c', text: 'YOU PRETEND TO BE ON A CALL.',             stats: { charm: 2, nerve: 1 } },
        { id: 'd', text: 'YOU TAKE NOTES ANYWAY.',                   stats: { wit: 2, taste: 1 } },
        { id: 'e', text: 'YOU START THE MEETING.',                   stats: { nerve: 2, charm: 1 } },
        { id: 'f', text: 'YOU FILE A COMPLAINT.',                    stats: { nerve: 2, charm: -1, wit: 1 } },
      ],
    },
    {
      id: 'q4',
      prompt: 'Pick a light you trust.',
      options: [
        { id: 'a', text: 'FLUORESCENT.',                             stats: { wit: 2, heart: -1 } },
        { id: 'b', text: 'DASHBOARD GREEN.',                         stats: { cool: 2, nerve: 1 } },
        { id: 'c', text: 'MOTEL SIGN RED.',                          stats: { heart: 2, taste: 1 } },
        { id: 'd', text: 'TAILLIGHT FROM ACROSS THE LOT.',           stats: { cool: 2, wit: 1 } },
        { id: 'e', text: 'VENDING MACHINE BLUE.',                    stats: { luck: 2, heart: 1 } },
        { id: 'f', text: 'THE ONE IN THE BATHROOM.',                 stats: { wit: 2, heart: 1 } },
      ],
    },
    {
      id: 'q5',
      prompt: 'Your lunch break is unaccounted for.',
      options: [
        { id: 'a', text: 'COFFEE NOT CONSUMED.',                     stats: { cool: 2, heart: -1 } },
        { id: 'b', text: 'RECEIPT WITH NO TOTAL.',                   stats: { luck: 2, wit: 1 } },
        { id: 'c', text: "A DIFFERENT BUILDING'S VENDING MACHINE.",   stats: { nerve: 2, luck: 1 } },
        { id: 'd', text: 'A SONG YOU CANNOT IDENTIFY.',              stats: { heart: 2, taste: 1 } },
        { id: 'e', text: 'NO PROOF OF THE BREAK AT ALL.',            stats: { nerve: 2, cool: 1 } },
        { id: 'f', text: 'YOU HAVE SEVERAL.',                        stats: { luck: 2, charm: 1 } },
      ],
    },
    {
      id: 'q6',
      prompt: "You're handed a key. Whose?",
      options: [
        { id: 'a', text: 'YOURS, RETURNED.',                         stats: { luck: 2, heart: 1 } },
        { id: 'b', text: 'YOURS, ORIGINALLY.',                       stats: { cool: 2, wit: 1 } },
        { id: 'c', text: 'NOT YOURS.',                               stats: { nerve: 2, wit: 1 } },
        { id: 'd', text: 'THE ONE FOR THE BACK OF THE BUILDING.',    stats: { nerve: 2, luck: 1 } },
        { id: 'e', text: 'A MOTEL.',                                 stats: { heart: 2, nerve: 1 } },
        { id: 'f', text: 'YOU HAND IT BACK.',                        stats: { cool: 2, luck: -1 } },
      ],
    },
    {
      id: 'q7',
      prompt: 'Pick an object the room recognizes.',
      options: [
        { id: 'a', text: 'CUE CHALK.',                               stats: { aim: 2, cool: 1 } },
        { id: 'b', text: 'WALL CLOCK (STUCK 1:47).',                 stats: { wit: 2, heart: 1 } },
        { id: 'c', text: 'FUZZY DICE (RED).',                        stats: { luck: 2, charm: 1 } },
        { id: 'd', text: 'RECEIPT.',                                 stats: { wit: 2, luck: 1 } },
        { id: 'e', text: 'MATCHBOOK.',                               stats: { taste: 2, nerve: 1 } },
        { id: 'f', text: 'HOTLINE POSTER.',                          stats: { heart: 2, luck: 1 } },
      ],
    },
    {
      id: 'q8',
      prompt: 'Pick a house rule you recognize.',
      options: [
        { id: 'a', text: 'DO NOT THANK THE ROOM.',                   stats: { wit: 2, cool: 1 } },
        { id: 'b', text: 'POOL IS IN THE DNA.',                      stats: { aim: 2, taste: 1 } },
        { id: 'c', text: 'CLOCK OUT. CHALK UP.',                     stats: { nerve: 2, aim: 1 } },
        { id: 'd', text: 'THE COFFEE IS NOT FRESH. IT IS ACTIVE.',    stats: { wit: 2, heart: -1 } },
        { id: 'e', text: 'YOU MAY LEAVE. YOU MAY NOT GO HOME.',       stats: { heart: 2, cool: 1 } },
        { id: 'f', text: 'BRING A HOODIE. THE LOT GETS COLD.',        stats: { heart: 2, taste: 1 } },
      ],
    },
    {
      id: 'q9',
      prompt: 'After hours, where do you go?',
      options: [
        { id: 'a', text: 'PARKING LOT.',                             stats: { cool: 2, nerve: 1 } },
        { id: 'b', text: 'STAY IN THE BATHROOM.',                    stats: { wit: 2, heart: 1 } },
        { id: 'c', text: 'THE MOTEL.',                               stats: { heart: 2, nerve: 1 } },
        { id: 'd', text: 'PHONE BEHIND THE BAR.',                    stats: { charm: 2, wit: 1 } },
        { id: 'e', text: 'THE LOT, BUT PARKED.',                     stats: { cool: 2, heart: 1 } },
        { id: 'f', text: 'DRIVE.',                                   stats: { nerve: 2, luck: 1 } },
      ],
    },
    {
      id: 'q10',
      prompt: 'One sentence about you, accidentally true.',
      options: [
        { id: 'a', text: '"I KEEP WHAT I\'M GIVEN."',                 stats: { cool: 2, luck: 1 } },
        { id: 'b', text: '"I LEAVE WITHOUT GOING HOME."',             stats: { nerve: 2, heart: 1 } },
        { id: 'c', text: '"I DON\'T APPLAUD."',                       stats: { nerve: 2, charm: -1 } },
        { id: 'd', text: '"I WASN\'T SUPPOSED TO BE HERE."',          stats: { luck: 2, nerve: 1 } },
        { id: 'e', text: '"I NOTICE THE CLOCK."',                     stats: { wit: 2, heart: 1 } },
        { id: 'f', text: '"I BRING A HOODIE."',                       stats: { heart: 2, taste: 1 } },
      ],
    },
  ],
};
