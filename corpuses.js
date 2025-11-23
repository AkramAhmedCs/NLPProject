/**
 * Sample Text Corpuses for Markov Chain Training
 */

const CORPUSES = {
  shakespeare: {
    title: "Shakespeare - Romeo and Juliet (Excerpt)",
    author: "William Shakespeare",
    text: `Two households, both alike in dignity, in fair Verona, where we lay our scene, from ancient grudge break to new mutiny, where civil blood makes civil hands unclean. From forth the fatal loins of these two foes a pair of star-cross'd lovers take their life; whose misadventured piteous overthrows do with their death bury their parents' strife. The fearful passage of their death-mark'd love, and the continuance of their parents' rage, which, but their children's end, nought could remove, is now the two hours' traffic of our stage; the which if you with patient ears attend, what here shall miss, our toil shall strive to mend.

But, soft! what light through yonder window breaks? It is the east, and Juliet is the sun. Arise, fair sun, and kill the envious moon, who is already sick and pale with grief, that thou her maid art far more fair than she. Be not her maid, since she is envious; her vestal livery is but sick and green and none but fools do wear it; cast it off. It is my lady, O, it is my love! O, that she knew she were! She speaks yet she says nothing: what of that? Her eye discourses; I will answer it. I am too bold, 'tis not to me she speaks. Two of the fairest stars in all the heaven, having some business, do entreat her eyes to twinkle in their spheres till they return.

O Romeo, Romeo! wherefore art thou Romeo? Deny thy father and refuse thy name; or, if thou wilt not, be but sworn my love, and I'll no longer be a Capulet. 'Tis but thy name that is my enemy; thou art thyself, though not a Montague. What's Montague? it is nor hand, nor foot, nor arm, nor face, nor any other part belonging to a man. O, be some other name! What's in a name? that which we call a rose by any other name would smell as sweet; so Romeo would, were he not Romeo call'd, retain that dear perfection which he owes without that title. Romeo, doff thy name, and for that name which is no part of thee take all myself.

Good night, good night! parting is such sweet sorrow, that I shall say good night till it be morrow. A thousand times good night! Love goes toward love, as schoolboys from their books, but love from love, toward school with heavy looks.`
  },

  hamlet: {
    title: "Shakespeare - Hamlet (Excerpt)",
    author: "William Shakespeare",
    text: `To be, or not to be, that is the question: whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them. To die: to sleep; no more; and by a sleep to say we end the heart-ache and the thousand natural shocks that flesh is heir to, 'tis a consummation devoutly to be wish'd. To die, to sleep; to sleep: perchance to dream: ay, there's the rub; for in that sleep of death what dreams may come when we have shuffled off this mortal coil, must give us pause. There's the respect that makes calamity of so long life; for who would bear the whips and scorns of time, the oppressor's wrong, the proud man's contumely, the pangs of despised love, the law's delay, the insolence of office and the spurns that patient merit of the unworthy takes, when he himself might his quietus make with a bare bodkin?

Something is rotten in the state of Denmark. Frailty, thy name is woman! A little more than kin, and less than kind. The lady doth protest too much, methinks. Though this be madness, yet there is method in't. Brevity is the soul of wit. There are more things in heaven and earth, Horatio, than are dreamt of in your philosophy.`
  },

  alice: {
    title: "Alice in Wonderland (Excerpt)",
    author: "Lewis Carroll",
    text: `Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do. Once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, and what is the use of a book, thought Alice, without pictures or conversations?

So she was considering in her own mind, as well as she could, for the hot day made her feel very sleepy and stupid, whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.

There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, Oh dear! Oh dear! I shall be late! But when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.

In another moment down went Alice after it, never once considering how in the world she was to get out again. The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.

Curiouser and curiouser! cried Alice. She had shrunk to such a very small height indeed! Now I'm opening out like the largest telescope that ever was! Goodbye, feet! Oh my poor little feet, I wonder who will put on your shoes and stockings for you now, dears? I'm sure I shan't be able! I shall be a great deal too far off to trouble myself about you.`
  },

  tech: {
    title: "Tech Blog Sample",
    author: "Sample",
    text: `Machine learning is revolutionizing the way we build software. Deep neural networks can learn complex patterns from data, enabling applications that were impossible just a few years ago. Natural language processing allows computers to understand and generate human language with remarkable accuracy.

The field of artificial intelligence continues to advance at a rapid pace. Researchers are developing new algorithms and architectures that push the boundaries of what's possible. Transfer learning enables models to leverage knowledge from one domain and apply it to another, dramatically reducing the amount of training data required.

Modern web development has evolved significantly over the past decade. Single-page applications have become the norm, providing users with smooth, app-like experiences. Frameworks like React, Vue, and Angular have revolutionized how we build interactive user interfaces. TypeScript has brought static typing to JavaScript, catching errors before they reach production.

Cloud computing has transformed software deployment and scaling. Containerization with Docker makes applications portable and easy to deploy. Kubernetes orchestrates containers at scale, handling load balancing and auto-scaling automatically. Serverless architectures allow developers to focus on code without managing infrastructure.

Data science combines statistics, programming, and domain expertise to extract insights from data. Data visualization helps communicate complex findings to stakeholders. A/B testing enables data-driven decision making. Predictive analytics can forecast future trends based on historical patterns.`
  },

  twitter: {
    title: "Social Media Style",
    author: "Sample",
    text: `Just deployed my new ML model to production! The accuracy is insane. Can't wait to share the results with the team tomorrow.

Coffee first, code later. Starting the day with a fresh cup and a clean codebase. Let's build something amazing today!

Hot take: the best code is the code you don't write. Sometimes the simplest solution is just to use an existing library.

Spending the weekend learning Rust. The borrow checker is tough but I'm starting to see why people love this language so much.

Pro tip: always write tests. Your future self will thank you when you need to refactor that spaghetti code at 2am.

Anyone else find debugging oddly satisfying? There's something therapeutic about finally finding that one semicolon that broke everything.

Shoutout to the amazing dev community! Y'all are always there with answers when Stack Overflow fails me. Open source rocks!

Remember when we thought 640k ought to be enough for anybody? Now my JavaScript node_modules folder is bigger than my first hard drive.

The documentation said it would be easy. Three hours later and I'm still reading GitHub issues from 2015. Send help.

Finally understood recursion today. To understand recursion, you must first understand recursion.

Imposter syndrome hitting hard today. Then I remembered that everyone feels this way sometimes. Keep pushing forward!

Pair programming is underrated. Two heads really are better than one, especially when hunting down that elusive bug.

Late night coding sessions hit different. The bugs are scarier but the breakthroughs feel more magical.`
  },

  scifi: {
    title: "Sci-Fi Sample",
    author: "Sample",
    text: `The starship drifted silently through the void, its hull gleaming in the light of distant stars. Captain Morrison stood on the bridge, watching the viewscreen with intense concentration. The alien vessel ahead showed no signs of life, yet every sensor indicated massive power readings emanating from its core.

We're receiving a transmission, sir, the communications officer reported. It's not in any known language, but the computer is attempting to translate.

The quantum drive hummed to life, bending spacetime around the vessel. In an instant, they crossed light-years of distance, emerging near a binary star system. Planets orbited in complex patterns, their trajectories calculated by AI systems far beyond human comprehension.

The android stood motionless, processing terabytes of information per second. Its neural network had evolved beyond its original programming, developing something that resembled consciousness. It pondered the nature of existence, wondering if artificial minds could truly achieve sentience.

Deep beneath the surface of the ice moon, ancient machines stirred to life. They had slumbered for millennia, waiting for the signal that would awaken them. Their purpose was encoded in crystalline matrices, instructions left by a civilization long vanished from the galaxy.

The time traveler stepped through the portal, emerging in a world transformed. Technology had advanced beyond imagination. Cities floated in the sky, powered by fusion reactors the size of buildings. Humanity had spread across the solar system, terraforming Mars and mining the asteroids.

Reality itself seemed to shimmer and shift. The quantum computer had achieved something unprecedented, simulating entire universes down to the subatomic level. Within its processors, civilizations rose and fell, never knowing they existed only as patterns of light and mathematics.`
  }
};
