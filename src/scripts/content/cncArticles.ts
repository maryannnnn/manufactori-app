export type CncArticle = {
  slug: string
  title: string
  h1: string
  previewTitle: string
  previewText: string
  metaTitle: string
  metaDescription: string
  publishedAt: string
  image: string
  alt: string
  blogCategorySlugs: string[]
  siteCategorySlugs: string[]
  sections: { heading: string; html: string }[]
  faq: { question: string; answer: string }[]
  discussion: {
    buyerAuthor: string
    buyerRole: string
    buyerDate: string
    buyerBody: string[]
    expertDate: string
    expertBody: string[]
  }[]
}

export const CNC_ARTICLES: CncArticle[] = [
  // ---------------------------------------------------------------------------
  // 1. Tolerances and GD&T
  // ---------------------------------------------------------------------------
  {
    slug: 'cnc-machining-tolerances-gdt-dimensional-accuracy',
    title:
      'CNC Machining Tolerances and GD&T: How to Achieve Dimensional Accuracy, Control Variation and Prevent Precision Manufacturing Defects',
    h1: 'CNC Machining Tolerances and GD&T: How to Achieve Dimensional Accuracy, Control Variation and Prevent Precision Manufacturing Defects',
    previewTitle: 'CNC Machining Tolerances and GD&T for Dimensional Accuracy',
    previewText:
      'How tolerances and GD&T control dimensional accuracy in CNC machining: datums, sources of variation, stack-ups, process capability, measurement and the cost trade-offs behind tight limits.',
    metaTitle: 'CNC Machining Tolerances and GD&T: Dimensional Accuracy',
    metaDescription:
      'How CNC machining tolerances and GD&T control dimensional accuracy: datums, process variation, stack-ups, measurement and cost trade-offs for precision parts.',
    publishedAt: '2026-05-22',
    image: 'blog-cnc-machining-tolerances-gdt.jpg',
    alt: 'Precision-machined metal component being measured with a digital micrometer on an inspection table next to an engineering drawing',
    blogCategorySlugs: ['cnc-precision-machining', 'metalworking-metal-manufacturing'],
    siteCategorySlugs: ['cnc-precision-machining', 'precision-machining'],
    sections: [
      {
        heading: `Why tolerance decisions shape both quality and price`,
        html: `<p>A tolerance is a statement about how much variation the design can accept and how much the manufacturer must pay to stay inside it. On a CNC drawing, every limit carries a cost implication. Tight limits call for stable machines, controlled temperature, careful fixturing, slower finishing passes, more frequent tool changes and more measurement time. Loose limits leave room for the process to run faster and to absorb normal drift without scrapping parts.</p>
<p>Many precision manufacturing defects begin on the drawing, not on the machine. A part is rejected because a datum was ambiguous, because a tolerance was copied from a similar part without checking function, or because a feature that mates with nothing received the same tight limits as a bearing bore. The shop then either quotes high to cover the risk or quotes low and discovers the problem during first-piece inspection.</p>
<p>This article looks at how tolerances and geometric dimensioning and tolerancing (GD&T) work in practice, where variation comes from and how to set limits that protect function without inflating cost. For a broader view of the sector and of how machining companies describe their capabilities, see the overview of <a href="/industrial/metalworking-metal-manufacturing">metalworking and metal manufacturing</a>. Companies that focus on this kind of work are grouped under <a href="/industrial/metalworking-metal-manufacturing/cnc-precision-machining">CNC precision machining</a>.</p>`,
      },
      {
        heading: `Size tolerances, fits and general tolerance blocks`,
        html: `<p>Size tolerances define the permitted range for a dimension such as a diameter, a slot width or a thickness. A plus-minus value, a limit pair or a fit designation all express the same idea: the measured size must fall between a lower and an upper limit. Fits between shafts and holes add a functional layer. A clearance fit leaves a gap for sliding or easy assembly, a press fit relies on interference, and a transition fit sits between the two.</p>
<p>Most drawings also carry a general tolerance block that applies to every dimension without its own limit. This block is easy to ignore and expensive to get wrong. If it is tighter than the part needs, the shop may price every untoleranced feature as if it were critical. If it is looser than the part needs, an uncontrolled dimension can drift into a range that affects assembly. Choose the general tolerance class deliberately and let only the functional features carry tighter values.</p>
<p>A practical habit is to sort features into three groups: functional features that mate with other parts or seals, reference features that locate the part in the assembly, and clearance or cosmetic features that do not affect performance. Tight limits belong mainly to the first two groups. Applying them to the third group adds machining and inspection time with no benefit to the end user.</p>`,
      },
      {
        heading: `GD&T basics: datums, form, orientation and location`,
        html: `<p>Plus-minus dimensioning controls size, but it says little about shape or position. A hole can be within its diameter limits and still be in the wrong place, out of square to the face or slightly tapered. GD&T adds a symbolic language that controls these properties directly. The main families are form (flatness, straightness, circularity, cylindricity), orientation (perpendicularity, parallelism, angularity), location (position, symmetry), profile and runout.</p>
<p>Datums are the foundation. A datum reference frame tells the machinist and the inspector which surfaces establish the coordinate system for measurement. The order matters: the primary datum constrains the most degrees of freedom, followed by the secondary and tertiary. A position tolerance on a bolt pattern referenced to the wrong datum can make a part measure good in one laboratory and bad in another.</p>
<p>One of the most useful aspects of GD&T is the bonus tolerance available with maximum material condition (MMC) on features of size. When a hole is machined larger than its minimum size, more positional freedom is available while assembly still works. Used carefully, this reduces scrap on assembly-driven features. Used carelessly, it can confuse inspection, so the intent should be clear and the inspection method agreed before production starts.</p>`,
      },
      {
        heading: `Where variation comes from in CNC machining`,
        html: `<p>No machining process produces identical parts. Variation is always present, and the engineering task is to know its sources well enough to keep the output inside the tolerance band. The most common contributors are:</p>
<ul>
<li>Machine geometry and calibration, including axis straightness, squareness and backlash that change slowly with wear.</li>
<li>Thermal growth of the spindle, the machine structure and the workpiece during a long run, which can shift dimensions between the first and the last part.</li>
<li>Tool wear and tool deflection, which change the cut diameter and the surface position as the cutter dulls or flexes under load.</li>
<li>Workholding and clamping, where excessive clamp force distorts thin sections that spring back after release.</li>
<li>Residual stress in the raw material, which can relieve itself as material is removed and move a finished feature.</li>
<li>Programming and offsets, including tool length and diameter compensation that depend on how carefully they were measured and entered.</li>
<li>Shop environment, such as temperature swings, coolant temperature and vibration from nearby equipment.</li>
</ul>
<p>These sources add up, and they rarely act alone. A thin-walled part clamped hard, cut with a worn tool and measured warm may fail for three reasons at once. Good process planning addresses the largest contributors first rather than chasing a single cause.</p>`,
      },
      {
        heading: `Tolerance stack-ups and design intent`,
        html: `<p>When several parts or several features combine to form a gap, an alignment or a clearance, their individual tolerances accumulate. A worst-case stack-up adds all limits directly and guarantees assembly if every part is within tolerance, but it often forces tighter limits than the function requires. A statistical stack-up assumes variation is distributed rather than stacked at the extremes, which allows looser limits when the process is stable and the quantity is large enough to justify the assumption.</p>
<p>The choice between the two methods is an economic decision as much as a technical one. Worst-case analysis suits safety-critical gaps and low volumes. Statistical analysis can reduce cost in higher volumes, but only if the supplier measures the features, tracks their distribution and reacts when the process drifts. Without that discipline, a statistical tolerance is only an optimistic guess.</p>
<p>Design intent should be visible on the drawing. If a flange must seat flat against a mating face, flatness and perpendicularity to a clear datum express that better than a tight thickness tolerance alone. If two bores must share an axis, a position or runout callout states the real requirement, while two separate diameter tolerances do not. Engineers reduce ambiguity by controlling the relationship that matters, not by tightening every dimension in sight.</p>`,
      },
      {
        heading: `Matching tolerances to process capability and cost`,
        html: `<p>Each machining process and machine has a range of tolerances it can hold reliably in a given material and part geometry. Standard milling and turning on a well-maintained machine can hold fairly tight size limits on rigid parts. Tighter limits, long slender features or thin walls usually demand extra finishing passes, in-process probing, grinding, honing or lapping. The exact numbers depend on the machine, the shop and the part, so they should be confirmed with the supplier rather than assumed from a table.</p>
<p>Cost typically rises quickly as tolerances tighten, because more of the process budget is spent on control rather than on cutting. The shop slows feeds for finishing, adds a semi-finish pass, probes more often, inspects every part instead of a sample and accepts a higher scrap risk. Some of that cost is unavoidable when function demands it. Much of it is avoidable when a limit was set by habit.</p>
<p>A helpful question during design review is what happens if this feature is at the edge of its range. If the answer is nothing noticeable, the tolerance can usually be relaxed. If the answer is a leak, noise, premature wear or an assembly that needs force, the tolerance deserves its price. Documenting that reasoning helps the next engineer who inherits the drawing. For related cost effects of design choices, see the discussion of <a href="/blog/cnc-precision-machining/cnc-machining-cost-optimisation-dfm-batch-size">CNC machining cost optimization</a>.</p>`,
      },
      {
        heading: `Measurement uncertainty and drawing clarity`,
        html: `<p>A tolerance is only meaningful if it can be measured. Every instrument has uncertainty, and when the uncertainty is a large fraction of the tolerance, good parts get rejected and bad parts get accepted. A common guideline is that the measurement system should be considerably more discriminating than the tolerance it checks, often cited as roughly ten times finer, although practical programs sometimes accept less with documented justification.</p>
<p>Measurement conditions also matter. Metal parts expand with temperature, and a part measured straight from the machine can differ from the same part after stabilizing in a controlled room. Fixture contact points, probe strategy and datum simulation all affect results on GD&T features. The drawing should state or imply the inspection conditions when they matter, and the customer and supplier should agree on them early.</p>
<p>Clear drawings reduce disputes. Each feature should have one interpretation, datums should be physically accessible and critical features should be identified. When tolerance disputes arise, they often trace back to a missing datum, a conflicting dimension or a note that contradicts the tolerance block. Inspection methods such as coordinate measuring machines and first article reports are covered in the article on <a href="/blog/cnc-precision-machining/cnc-machining-quality-control-cmm-first-article-inspection">CNC machining quality control and CMM inspection</a>.</p>`,
      },
      {
        heading: `A drawing review checklist before release`,
        html: `<p>A short review before a drawing goes to a supplier prevents most tolerance-related defects and quoting surprises. The checklist below is a starting point and should be adapted to the product and industry.</p>
<ul>
<li>Is every datum a real, accessible surface, and does the datum order reflect how the part mounts in the assembly?</li>
<li>Are tight tolerances limited to functional and reference features, with a deliberately chosen general tolerance for the rest?</li>
<li>Are form and orientation controls used where function depends on shape, instead of relying on a size tolerance to do both jobs?</li>
<li>Do any two dimensions or notes conflict, or define the same feature twice?</li>
<li>Has the tolerance stack been checked for the assemblies where the part matters, using a method appropriate to the volume and risk?</li>
<li>Can each toleranced feature be measured with a method and a fixture the supplier can realistically provide?</li>
<li>Do coatings, plating or heat treatment change a dimension that carries a tight limit, and is the limit stated before or after processing?</li>
<li>Have you asked the supplier which tolerances they consider difficult for this material and geometry?</li>
</ul>
<p>The last question is often the most useful. A machinist who sees the part before production can usually point to two or three features that drive cost and suggest alternatives that preserve function. Selecting a partner who engages in that conversation is easier when you understand how specialists describe their work, which is why the overview of <a href="/industrial/metalworking-metal-manufacturing/cnc-precision-machining">CNC precision machining</a> is a practical starting point for supplier comparison.</p>`,
      },
    ],
    faq: [
      {
        question: 'What is the difference between a size tolerance and a GD&T callout?',
        answer:
          'A size tolerance limits how large or small a feature can be, such as a hole diameter. A GD&T callout controls geometric properties such as flatness, perpendicularity or position relative to datums. A part can pass its size limits and still fail geometric requirements, so functional features often need both.',
      },
      {
        question: 'Why do tighter CNC tolerances increase part cost?',
        answer:
          'Tighter limits require slower finishing passes, more frequent tool changes and offsets, additional in-process or final measurement, more careful workholding and a higher scrap risk. In some cases a separate grinding or honing operation is needed. The cost increase depends on the part, material and shop, and should be confirmed with a quote.',
      },
      {
        question: 'How do I know which features really need tight tolerances?',
        answer:
          'Start from function. Features that mate with other parts, seal fluids, carry bearings or locate the part in the assembly usually need controlled limits. Clearance surfaces and cosmetic features often do not. Ask what happens if a feature is at the edge of its range, and tighten only where the answer is a functional problem.',
      },
      {
        question: 'What is a datum and why does it matter on a machining drawing?',
        answer:
          'A datum is a theoretical reference derived from a real surface or feature that establishes the coordinate system for measuring other features. The machinist uses it to set up the part and the inspector uses it to evaluate location and orientation. An unclear or inaccessible datum is a frequent source of disputes between customers and suppliers.',
      },
      {
        question: 'Can coatings or heat treatment change toleranced dimensions?',
        answer:
          'Yes. Plating and anodizing add or alter material on the surface, and heat treatment can cause distortion or dimensional change. The drawing should state whether a tolerance applies before or after processing, and the shop should plan machining allowances accordingly. The related effects are discussed in the article on surface finish and post-processing.',
      },
    ],
    discussion: [
      {
        buyerAuthor: 'Henrik Solberg',
        buyerRole: 'Mechanical Design Engineer',
        buyerDate: '2026-05-24',
        buyerBody: [
          'Our drawings use a tight general tolerance block because it was inherited from an older product. Suppliers keep quoting high. Should we loosen it for the whole drawing family?',
        ],
        expertDate: '2026-05-27',
        expertBody: [
          'Usually the better approach is to review which features actually need that tolerance, then set the general block to match the real needs of the product. If most of the part is clearance geometry, a tighter block forces suppliers to price caution into features that do not matter.',
          'Do it drawing by drawing at first, starting with the highest-volume parts. Keep tighter explicit limits on functional features and record the reason in the engineering notes. That way, the next change is easier to defend.',
        ],
      },
      {
        buyerAuthor: 'Aisha Rahman',
        buyerRole: 'Quality Engineer',
        buyerDate: '2026-06-02',
        buyerBody: [
          'Our incoming inspection and the supplier report different position results on the same bolt pattern. Where do we start looking?',
        ],
        expertDate: '2026-06-05',
        expertBody: [
          'Check the datum setup first. Differences in how the part was fixtured, which surfaces were used as primary, secondary and tertiary datums, and whether material condition modifiers were applied correctly explain a large share of position disagreements.',
          'Then compare probing strategy and temperature conditions. A short joint review, with both parties measuring the same part using the same datum simulation, usually clarifies the cause faster than exchanging reports.',
        ],
      },
      {
        buyerAuthor: 'Gabriel Santos',
        buyerRole: 'Procurement Specialist',
        buyerDate: '2026-06-09',
        buyerBody: [
          'How can I tell whether a supplier is quoting a tight tolerance honestly or just padding the price?',
        ],
        expertDate: '2026-06-12',
        expertBody: [
          'Ask which features drive the quote and what process they plan for them. A supplier who has studied the drawing can usually name the difficult features, mention the extra operations such as finishing passes, grinding or probing, and explain what they would change.',
          'Padding tends to be generic. Real cost drivers are specific. If two suppliers disagree widely, ask each for the assumptions behind the price instead of comparing totals alone.',
        ],
      },
      {
        buyerAuthor: 'Katarzyna Wojcik',
        buyerRole: 'Product Development Manager',
        buyerDate: '2026-06-16',
        buyerBody: [
          'We are planning a statistical tolerance approach for a higher-volume part. What should we require from the supplier before accepting it?',
        ],
        expertDate: '2026-06-19',
        expertBody: [
          'Require measured data on the critical features, not only a promise. That means a defined sampling plan, a record of the distribution and a response plan when the process drifts. Without data, the statistical assumption has no support.',
          'Also agree what happens if the data shows the process is not as stable as expected. The options are tightening the process, adding inspection or reverting to worst-case limits. Settling that before launch avoids a difficult conversation later.',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 2. Materials and machinability
  // ---------------------------------------------------------------------------
  {
    slug: 'cnc-machining-materials-machinability-metal-selection',
    title:
      'CNC Machining Materials and Machinability: How to Select Aluminium, Stainless Steel, Titanium and Other Metals for Precision Parts',
    h1: 'CNC Machining Materials and Machinability: How to Select Aluminium, Stainless Steel, Titanium and Other Metals for Precision Parts',
    previewTitle: 'CNC Machining Materials and Machinability: Choosing the Right Metal',
    previewText:
      'How machinability affects the choice of aluminum, steel, stainless steel and titanium for precision CNC parts, including tool wear, heat, chip control, stock availability and cost.',
    metaTitle: 'CNC Machining Materials and Machinability Guide for Metals',
    metaDescription:
      'How to select aluminum, stainless steel, titanium and other metals for CNC precision parts: machinability, tool wear, heat, stock and cost trade-offs.',
    publishedAt: '2026-06-28',
    image: 'blog-cnc-machining-materials-machinability.jpg',
    alt: 'CNC milling cutter machining a metal workpiece with coolant visible in a modern machine shop',
    blogCategorySlugs: ['cnc-precision-machining', 'metalworking-metal-manufacturing'],
    siteCategorySlugs: ['cnc-precision-machining', 'metalworking'],
    sections: [
      {
        heading: `Material choice is a manufacturing decision as well as a design decision`,
        html: `<p>Designers usually choose a metal for its strength, corrosion resistance, weight, thermal behavior or regulatory acceptance. Those reasons are valid, but they are only half of the decision. The same alloy also determines how fast the part can be cut, how long tools last, how much heat enters the workpiece, how the part moves when material is removed and how much finishing work follows. Two materials that look equivalent on a datasheet can differ widely in machining cost.</p>
<p>The result is a recurring pattern. A part is designed in a difficult alloy because it was the first one that met the strength requirement, and no one asks whether a more machinable grade would also work. The supplier then quotes long cycle times, special tooling and a higher scrap allowance, and the buyer attributes the price to the shop rather than to the material.</p>
<p>This article explains machinability in practical terms and compares the metals most often used for precision machined parts, with attention to the trade-offs that appear in tooling, stability and cost. For context on how machining companies fit into the wider sector, see the overview of <a href="/industrial/metalworking-metal-manufacturing">metalworking and metal manufacturing</a>. Specialist suppliers are listed under <a href="/industrial/metalworking-metal-manufacturing/cnc-precision-machining">CNC precision machining</a>.</p>`,
      },
      {
        heading: `What machinability actually means`,
        html: `<p>Machinability is not a single property. It is a combination of how a material behaves when a cutting edge engages it. Shops look at tool life, the cutting speed that can be sustained, the surface finish that results, the cutting forces and power required, and how the chips form and break. A material may score well on one measure and poorly on another. A gummy aluminum alloy can cut at very high speed but wrap long chips around the tool, while a hard steel may break chips cleanly but wear the edge quickly.</p>
<p>Several material characteristics drive these behaviors. Hardness and strength affect cutting force. Thermal conductivity determines whether heat leaves with the chip or stays in the tool and the part. Work hardening tendency decides whether a light or hesitant cut makes the next pass harder. Microstructure, inclusions and added elements such as sulfur change how chips break. Heat treatment state matters as much as the alloy name.</p>
<p>Machinability ratings published in handbooks are useful for rough comparison, but they are averages measured under specific conditions. A shop's real experience with the exact grade, tooling and machine often matters more than a published index. Ask suppliers which alloys they machine routinely, because a familiar material usually means a stable process and a more reliable price.</p>`,
      },
      {
        heading: `Aluminum alloys: fast removal, thin-wall risks and burrs`,
        html: `<p>Aluminum is among the easiest metals to cut. It allows high spindle speeds and rapid material removal, and tool wear is usually modest with the right geometry. This makes aluminum attractive for housings, brackets, fixtures, heat sinks and prototype parts, where machining time is the dominant cost and the material itself is relatively inexpensive.</p>
<p>The common wrought grades behave differently. Alloys such as 6061 are widely stocked and machine well with good corrosion resistance and weldability. Higher-strength grades such as 7075 suit structural parts that need more strength but may be more demanding on tooling and more prone to stress-related movement. Cast aluminum can contain porosity or hard inclusions that appear only after machining opens the surface.</p>
<p>The challenges are mostly about stability and chip handling. Aluminum expands noticeably with temperature, so tight features need controlled coolant and a stable shop temperature. Thin walls and large pockets can deflect or chatter, especially when large volumes of material are removed from plate with internal stress. Long stringy chips can jam in deep pockets, and burrs on edges and cross holes can add deburring time. Roughing, stress-relief pauses and a lighter finishing allowance are common strategies for keeping thin parts flat.</p>`,
      },
      {
        heading: `Carbon steels, alloy steels and tool steels`,
        html: `<p>Steel covers a wide range of machinability. Low-carbon and free-machining grades are cut easily and produce short chips that clear well, which suits high-volume turned parts. Medium-carbon and alloy steels offer higher strength and wear resistance with more demanding cutting conditions. Tool steels are chosen for hardness and wear resistance and are often machined in a softened state before hardening.</p>
<p>Heat treatment state is a central planning factor. Machining in the annealed condition is faster and gentler on tools, but the part will move during hardening and typically needs a finishing operation afterward, such as grinding, to restore size and geometry. Machining in a pre-hardened condition avoids distortion from heat treatment but increases tool wear and cycle time. The right choice depends on the required hardness, the tolerance and the quantity.</p>
<p>Free-machining steels contain additives that improve chip breaking and tool life, but those additives can affect weldability, corrosion behavior and in some cases regulatory suitability for specific applications. If the part will be welded, plated or used in a regulated product, confirm that the chosen grade is acceptable before it is committed to the drawing. A slightly slower grade can be cheaper overall if it avoids downstream problems.</p>`,
      },
      {
        heading: `Stainless steels: work hardening and heat control`,
        html: `<p>Stainless steels are selected for corrosion resistance, hygiene or strength at temperature, and they are widely used in food, medical, marine and chemical equipment. They are generally harder to machine than carbon steels, mostly because of work hardening and low thermal conductivity. Heat concentrates at the cutting edge, tool life drops and a surface hardened by a rubbing pass can make the next cut more difficult.</p>
<p>Grades behave differently. Austenitic grades such as 304 and 316 are tough and gummy, with long chips and a strong work hardening tendency. Free-machining variants such as 303 cut more easily but have reduced corrosion resistance compared with the standard grades. Precipitation-hardening grades such as 17-4 PH can be machined in a softer condition and then aged to higher strength, which suits parts that need strength with limited distortion.</p>
<p>Practical machining strategies include sharp tooling with suitable coatings, constant feed rather than light rubbing passes, rigid setups and effective coolant delivery. The surface finish and any later passivation also depend on clean machining without embedded iron or overheated layers. Tool cost and cycle time make stainless parts more expensive than comparable carbon steel parts, so choose it where corrosion or hygiene requirements truly justify it, not as a default.</p>`,
      },
      {
        heading: `Titanium and nickel-based alloys`,
        html: `<p>Titanium alloys offer high strength relative to weight and good corrosion resistance, which is why they appear in aerospace, medical and high-performance applications. They are also demanding to machine. Titanium conducts heat poorly, so heat stays in the cutting zone and wears the tool. It can react with tool materials at high temperature and has a relatively low elastic modulus, which makes thin features spring away from the cutter.</p>
<p>Nickel-based superalloys are used where strength at high temperature and corrosion resistance are critical. They work harden strongly, cut at low speeds and wear tools quickly. Cutting parameters are conservative compared with steel, and tool changes are frequent. Cycle times are long, and so is the lead time when raw material availability is limited.</p>
<p>Successful machining of these alloys depends on rigid machines and workholding, sharp tools with suitable coatings, generous and well-directed coolant, and stable cutting conditions without dwelling or rubbing. Programs often use toolpaths that keep the cutter engagement steady to limit heat spikes. The material is expensive, scrap is costly and setup mistakes are unforgiving, so the supplier's experience with the exact alloy carries more weight than it does for aluminum. A shop that rarely cuts titanium may quote conservatively or may underestimate the difficulty.</p>`,
      },
      {
        heading: `Stock, certification and lead time`,
        html: `<p>Machinability is not the only factor that affects cost. Material availability in the required form and size matters, because buying a standard bar, plate or tube is usually faster and cheaper than ordering a special size or a mill-run quantity. An alloy that is common in one region may have long lead times in another. Designing around standard stock sizes can reduce both material waste and delay.</p>
<p>Certification requirements add cost and time. Some industries require mill certificates, chemical and mechanical test reports, lot traceability or specific material standards. These documents belong in the purchase specification from the start, because discovering them after the order is placed may force a change of material source. The same applies to restricted substances and country-of-origin requirements in certain markets.</p>
<p>Buy-to-fly ratio, the ratio between the raw material mass and the finished part mass, is a useful concept even outside aerospace. When most of an expensive bar becomes chips, material cost and machining time both rise. Near-net-shape stock, forgings or castings can lower cost at sufficient volume, though they bring tooling cost and their own variability. The cost effects of design and batch size are covered in the article on <a href="/blog/cnc-precision-machining/cnc-machining-cost-optimisation-dfm-batch-size">CNC machining cost optimization</a>.</p>`,
      },
      {
        heading: `A practical approach to selecting the material`,
        html: `<p>A structured approach avoids both over-specifying and under-specifying. The following questions help bring machinability into the decision without losing sight of function.</p>
<ul>
<li>What are the essential functional requirements, such as strength, corrosion exposure, temperature, weight, conductivity or hygiene?</li>
<li>Which alloys and tempers meet those requirements, and which of them are stocked in the form and size required?</li>
<li>Does the part need heat treatment, plating or anodizing, and how does that interact with the choice of alloy and the tolerances?</li>
<li>How does the material affect the tolerance and surface finish the shop can hold, as discussed in the article on <a href="/blog/cnc-precision-machining/cnc-machining-tolerances-gdt-dimensional-accuracy">CNC machining tolerances and GD&T</a>?</li>
<li>What certification, traceability and documentation does the application require?</li>
<li>Would a more machinable alternative reduce cost without compromising function, and has the supplier been asked for an opinion?</li>
</ul>
<p>The last question often yields the best result. Many machine shops have experience with substitutions that meet the same specification and cut faster, such as a different temper of the same aluminum alloy or a free-machining stainless variant where corrosion resistance allows. A short conversation before drawing release is cheaper than a redesign after the first quote. To compare suppliers by the materials and processes they describe, use the overview of <a href="/industrial/metalworking-metal-manufacturing/cnc-precision-machining">CNC precision machining</a>.</p>`,
      },
    ],
    faq: [
      {
        question: 'What does machinability mean in CNC machining?',
        answer:
          'Machinability describes how easily a material can be cut. It includes tool life, achievable cutting speed, surface finish, cutting forces and chip behavior. A material can rate well on one factor and poorly on another, so shops judge machinability from practical experience with the specific grade, tooling and machine.',
      },
      {
        question: 'Why is stainless steel more expensive to machine than aluminum?',
        answer:
          'Stainless steel cuts at lower speeds, work hardens, conducts heat poorly and wears tools faster. Cycle times are longer and tooling costs are higher. The raw material is also typically more expensive per unit of volume. Aluminum permits much higher removal rates, although the actual price difference depends on the part and the shop.',
      },
      {
        question: 'Why is titanium considered difficult to machine?',
        answer:
          'Titanium conducts heat poorly, so heat concentrates in the tool. It can react with cutting tools at high temperature and is relatively flexible, which makes thin features deflect. These factors require conservative parameters, rigid setups, sharp tools and strong coolant delivery, which increase cycle time and cost.',
      },
      {
        question: 'Does heat treatment affect the choice of material for CNC parts?',
        answer:
          'Yes. Machining before hardening is easier on tools but may require finishing after heat treatment because parts can distort. Machining in a hardened state avoids that distortion but increases tool wear and cycle time. The right sequence depends on tolerance, hardness, geometry and quantity.',
      },
      {
        question: 'Should I ask my machining supplier for material recommendations?',
        answer:
          'Yes, ideally before the drawing is released. Suppliers often know which equivalent grades or tempers cut faster, are easier to source or hold tolerance better. They cannot change a specified material without approval, but an early conversation can reveal options that preserve function and reduce cost.',
      },
    ],
    discussion: [
      {
        buyerAuthor: 'Takumi Hayashi',
        buyerRole: 'Design Engineer',
        buyerDate: '2026-06-30',
        buyerBody: [
          'We specified 316 stainless for a housing mainly because it was used on a previous product. Quotes are high. How do we check whether a different grade is acceptable?',
        ],
        expertDate: '2026-07-03',
        expertBody: [
          'Start from the actual environment. Identify the fluids, chlorides, cleaning agents and temperatures the housing will see, then compare those with the requirements of alternatives. If the exposure is mild, a more machinable stainless or a coated carbon steel may meet the need.',
          'Document the review and, where the product is regulated, confirm that the change does not affect approvals. Then ask suppliers to quote both grades so the saving is visible before you commit to a change.',
        ],
      },
      {
        buyerAuthor: 'Noor Hamdan',
        buyerRole: 'Sourcing Manager',
        buyerDate: '2026-07-08',
        buyerBody: [
          'A supplier quoted much longer lead time for titanium parts than for similar aluminum ones. Is that normal?',
        ],
        expertDate: '2026-07-11',
        expertBody: [
          'It is common. Titanium cycle times are longer, tool changes are frequent and raw material may have longer procurement times, particularly with certification requirements. Capacity on rigid machines suited to the alloy can also be limited.',
          'You can often shorten the schedule by specifying standard stock sizes, confirming certification needs early and agreeing on a clear inspection plan. Asking the supplier to split the lead time into material, machining and finishing shows which part you can influence.',
        ],
      },
      {
        buyerAuthor: 'Pedro Almeida',
        buyerRole: 'Manufacturing Engineer',
        buyerDate: '2026-07-15',
        buyerBody: [
          'Our thin-walled aluminum parts come out flat on the machine but are bowed the next day. What should we look at?',
        ],
        expertDate: '2026-07-18',
        expertBody: [
          'That pattern often points to residual stress in the plate or to clamping distortion that recovers after release. Check how much material is removed asymmetrically and whether the supplier uses a stress-relief pause between roughing and finishing.',
          'Options include using stress-relieved plate tempers, balancing material removal from both sides, lighter clamping and a finishing pass after the part has rested. These steps can add cost, so apply them to the parts where flatness truly matters.',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 3. Cost optimisation, DFM, batch size
  // ---------------------------------------------------------------------------
  {
    slug: 'cnc-machining-cost-optimisation-dfm-batch-size',
    title:
      'CNC Machining Cost Optimisation: How Part Design, Setup Time, Batch Size and Production Planning Determine the Price of Precision Components',
    h1: 'CNC Machining Cost Optimisation: How Part Design, Setup Time, Batch Size and Production Planning Determine the Price of Precision Components',
    previewTitle: 'CNC Machining Cost Optimization: Design, Setup and Batch Size',
    previewText:
      'What drives the price of CNC machined parts: setup time, cycle time, material, tolerances, inspection and batch size, with a DFM checklist and practical ways to lower cost without losing function.',
    metaTitle: 'CNC Machining Cost Optimization: DFM and Batch Size',
    metaDescription:
      'What determines the price of CNC machined parts: setup time, cycle time, design features, tolerances and batch size, with a DFM checklist to reduce cost.',
    publishedAt: '2026-08-05',
    image: 'blog-cnc-machining-cost-optimisation.jpg',
    alt: 'Modern CNC machining centre with a precision component, tooling and workholding fixture in a bright production cell',
    blogCategorySlugs: ['cnc-precision-machining', 'metalworking-metal-manufacturing'],
    siteCategorySlugs: ['cnc-precision-machining', 'precision-machining'],
    sections: [
      {
        heading: `What sits inside a CNC machining quote`,
        html: `<p>A machining quote looks like a single number, but it is built from several separate costs. Raw material, programming, setup, machine time, tooling, secondary operations, inspection, packaging, overhead and margin all contribute. Which of them dominates depends on the part. A large aluminum bracket in a small run may be mostly setup and programming. A small stainless fitting in thousands may be mostly cycle time and tooling. Reducing cost starts with knowing which component is large for your part.</p>
<p>Buyers often compare quotes by the unit price alone and then wonder why two shops differ so much. The difference may come from different assumptions about batch size, different setup strategies, different material sources or a different view of how risky the tolerances are. A quote that is low because it ignores a difficult feature will come back as a change request or a quality problem.</p>
<p>This article follows the cost through design, setup, batch size and planning, and gives a practical checklist for design for manufacturability (DFM). For a wider view of how machining suppliers sit within the sector, see the overview of <a href="/industrial/metalworking-metal-manufacturing">metalworking and metal manufacturing</a>. Companies offering this work are collected under <a href="/industrial/metalworking-metal-manufacturing/cnc-precision-machining">CNC precision machining</a>.</p>`,
      },
      {
        heading: `Setup time and the effect of batch size`,
        html: `<p>Every job needs a setup: loading programs, installing tools, mounting the workholding, touching off the part, and running and inspecting a first piece. That time is spent whether one part or a thousand parts follow. Dividing the setup cost across the batch is the main reason that unit prices fall with quantity.</p>
<p>A simple illustration shows the scale of the effect. Suppose, purely as an example, that a setup takes two hours and each part needs ten minutes of machining. For a batch of six parts, the setup adds twenty minutes per part, twice the machining time. For a batch of 120 parts, it adds one minute per part. The part has not changed, but its price has, because the fixed cost is spread differently.</p>
<p>This has practical consequences for purchasing. Ordering small quantities repeatedly pays the setup cost again each time, unless the shop keeps the fixture, program and tooling ready. Consolidating orders into fewer, larger batches usually reduces unit cost, but ties up cash and storage and risks obsolescence if the design changes. A blanket order with scheduled releases can capture some of the benefit while limiting inventory. Asking the supplier to quote several quantities, such as 10, 50 and 250, shows where the price curve flattens for your part.</p>`,
      },
      {
        heading: `Design features that drive cycle time and risk`,
        html: `<p>Some geometry is inherently cheap to machine and some is not. The features below tend to raise cost because they lengthen cycle time, require special tools or add setups.</p>
<ul>
<li>Deep, narrow pockets and slots that need long, slender tools, which deflect and force slower cuts.</li>
<li>Sharp internal corners, which require very small cutters or additional operations, instead of radii that match a standard tool.</li>
<li>Thin walls and tall, slender features that vibrate or distort and demand light cuts and extra care.</li>
<li>Features on several faces, which require repeated reorientation or a multi-axis machine and increase the chance of alignment error between setups.</li>
<li>Blind holes with tight depth and flatness requirements, or threads running to the bottom of a hole.</li>
<li>Uniformly tight tolerances and fine surface finishes across the entire part, instead of on the functional features only.</li>
<li>Large amounts of material removed from thick stock when a closer starting shape is available.</li>
</ul>
<p>None of these features is wrong. Each exists in parts for good reasons. The point is to recognize that they carry a cost and to confirm that the function behind each feature justifies it. A few small changes, such as increasing an internal radius to suit a standard cutter or moving a hole to a more accessible face, can remove an entire setup.</p>`,
      },
      {
        heading: `A DFM checklist before releasing the drawing`,
        html: `<p>A short design for manufacturability review before sending a drawing out can remove avoidable cost. Use the checklist below as a starting point and adapt it to your product.</p>
<ul>
<li>Can internal corner radii be made larger and consistent so that one tool can cut them?</li>
<li>Are pocket depths reasonable relative to their width, and are walls thick enough to resist deflection?</li>
<li>Can all features be reached from as few orientations as possible, ideally with one or two setups?</li>
<li>Are hole sizes and thread sizes standard, so that common drills, taps and gauges apply?</li>
<li>Are tolerances tight only where function requires, with a deliberate general tolerance elsewhere, as discussed in the article on <a href="/blog/cnc-precision-machining/cnc-machining-tolerances-gdt-dimensional-accuracy">CNC machining tolerances and GD&T</a>?</li>
<li>Is the surface finish specified only where it matters, and is it achievable directly from machining?</li>
<li>Is the material the most machinable one that meets the requirement, and is it available in a standard stock size?</li>
<li>Are there places for the part to be clamped without damaging critical surfaces?</li>
<li>Have deburring needs and edge conditions been stated, for example break edges as a general note instead of per-edge requirements?</li>
<li>Do coatings and heat treatment have defined allowances and masking requirements?</li>
</ul>
<p>Sharing the draft with the supplier before final release often yields better answers than any checklist, because the supplier knows the machines and fixtures that will be used. Many shops are willing to give informal feedback when they understand that a quote may follow.</p>`,
      },
      {
        heading: `How material and stock selection affect the price`,
        html: `<p>Material cost enters the price twice: once as the raw stock and once through machining time. A material that is cheap per kilogram but slow to cut can cost more overall than a more expensive one that machines quickly. The reverse is also true for very high-value alloys, where scrap and material waste become the dominant risk.</p>
<p>Stock form is part of the calculation. A part designed to fit a standard plate thickness or bar diameter avoids the cost of machining away unnecessary material and sourcing special sizes. If the finished part is a small fraction of the stock it came from, consider whether a different starting shape, such as a profile extrusion, a forging or a near-net casting, could be economical. Those options usually need tooling and sufficient volume to pay back.</p>
<p>Material choice also affects the finishing stages. Some alloys anodize or plate more predictably than others, and some require stress relief to hold flatness. Combining machinability, stock availability and finishing behavior in the selection decision, as discussed in the article on <a href="/blog/cnc-precision-machining/cnc-machining-materials-machinability-metal-selection">CNC machining materials and machinability</a>, tends to give a better total result than choosing on one criterion alone.</p>`,
      },
      {
        heading: `Tolerances, finishes and inspection as cost multipliers`,
        html: `<p>Tolerance and finish requirements affect cost through several mechanisms at once. The cutting itself may need a slower finishing pass or a separate operation. Tool wear must be monitored more closely. Scrap risk increases, which shows up as either scrap cost or a higher price to cover it. Inspection time grows, because more features need measurement, more often, with more capable equipment.</p>
<p>Inspection requirements are sometimes overlooked in the cost discussion. A drawing that requires full inspection of every feature on every part, a coordinate measuring machine report and material certificates can add significant time per part, particularly for small batches. That may be necessary for critical components, but it should be a conscious decision. Requirements can often be tiered, with full reports for first articles, sampling for stable processes and full inspection only for critical characteristics. The practices involved are covered in the article on <a href="/blog/cnc-precision-machining/cnc-machining-quality-control-cmm-first-article-inspection">CNC machining quality control and inspection</a>.</p>
<p>Secondary operations such as heat treatment, plating, anodizing, passivation, marking and assembly add cost and lead time, and they add handling and transport between facilities. Each also carries a quality risk, because a part that was in tolerance after machining can move or change dimension afterward. Treat these steps as part of the cost model from the start, not as an afterthought to the machining quote.</p>`,
      },
      {
        heading: `Production planning: fixtures, repeat orders and machine selection`,
        html: `<p>Planning decisions on the shop floor change the price as much as design does. Dedicated fixtures reduce setup time and improve repeatability, but their cost needs volume or repeat orders to recover. Modular or soft-jaw workholding is cheaper for small batches. For a part that will be ordered repeatedly over years, investing in a good fixture and a proven program usually pays back through faster setups and fewer first-piece adjustments.</p>
<p>Machine selection matters too. A five-axis machine can reach several faces in one clamping, reducing setups and alignment error, but its hourly rate is higher than that of a three-axis machine. Whether it is cheaper depends on how many setups it replaces. For turned parts, bar feeding and live tooling can finish a part in one operation, which suits higher volumes. For small quantities, a flexible manual-assisted process may be the more economical route.</p>
<p>Part families and standardization offer additional savings. If several parts share a stock size, a fixture design and a set of tools, the shop can batch them in one setup sequence. Designers who standardize features such as hole sizes, thread types and corner radii across a product line make this easier. Regular forecasts help too: a supplier who knows next quarter's demand can plan material purchases and machine capacity and may offer better pricing and delivery in return.</p>`,
      },
      {
        heading: `Comparing quotes and total cost of ownership`,
        html: `<p>The cheapest quote is not always the lowest cost. The true cost includes scrap, rework, late deliveries, incoming inspection, line stoppages from nonconforming parts and the engineering time spent resolving disputes. A supplier with a higher unit price but stable processes, clear communication and reliable delivery may cost less over the life of the program.</p>
<p>When comparing quotes, align the assumptions first. Confirm that all suppliers priced the same material, quantity, tolerances, finishes, inspection level, packaging and delivery terms. Ask what each assumed for setup, whether tooling or fixtures are charged separately and who owns them. Ask whether the price holds for repeat orders and for which volume range. Differences that look like pricing are often differences in scope.</p>
<p>It is also useful to ask suppliers for cost-reduction suggestions as part of the quote process. A supplier who proposes a larger radius, a standard thread or a different stock size is usually looking at the part carefully. If you want to compare how different machining companies describe their equipment and services, the overview of <a href="/industrial/metalworking-metal-manufacturing/cnc-precision-machining">CNC precision machining</a> is a reasonable place to start. Keep the comparison disciplined: same drawing, same assumptions, same scope.</p>`,
      },
    ],
    faq: [
      {
        question: 'Why is the unit price of CNC parts much higher for small batches?',
        answer:
          'Setup, programming and first-piece inspection are fixed costs that are spread across the batch. With few parts, each part carries a large share. As the quantity grows, that share falls, and the unit price approaches machine time plus material. The curve depends on the part, so ask for quotes at several quantities.',
      },
      {
        question: 'Which design features most often increase CNC machining cost?',
        answer:
          'Deep narrow pockets, sharp internal corners, thin walls, features on many faces, uniformly tight tolerances, fine surface finishes everywhere and difficult-to-machine materials are common drivers. Each can be justified by function, but each should be checked, because small design changes often remove time or an entire setup.',
      },
      {
        question: 'How can I reduce machining cost without lowering quality?',
        answer:
          'Review tolerances and finishes so that tight values apply only to functional features, use standard radii and hole sizes, choose a machinable material in standard stock, minimize setups and consolidate orders where practical. Involving the supplier in a design review before release is often the most effective step.',
      },
      {
        question: 'Is a five-axis machine always more cost-effective for complex parts?',
        answer:
          'Not always. It can reduce setups and improve accuracy between faces, but it usually has a higher hourly rate and may need more programming time. It tends to pay off when it replaces several setups on a complex part. For simpler parts, a three-axis machine with a well-designed fixture may be cheaper.',
      },
      {
        question: 'What should I check when two CNC quotes differ widely?',
        answer:
          'Confirm that both suppliers assumed the same material, quantity, tolerances, finishes, inspection requirements and delivery terms. Ask about setup and tooling charges, ownership of fixtures and repeat-order pricing. A large difference often reflects a different understanding of scope or risk and not a difference in efficiency.',
      },
    ],
    discussion: [
      {
        buyerAuthor: 'Ingrid Halvorsen',
        buyerRole: 'Purchasing Manager',
        buyerDate: '2026-08-07',
        buyerBody: [
          'We order 20 parts every month. Would moving to quarterly orders of 60 really lower the price enough to justify holding stock?',
        ],
        expertDate: '2026-08-10',
        expertBody: [
          'It depends on how large setup is relative to machining time. If the setup takes hours and the cycle is short, the saving can be meaningful. Ask the supplier to quote both quantities and show the setup share, then compare the saving with your holding cost and the risk of design changes.',
          'A blanket order with monthly releases may capture much of the benefit without as much inventory. That works best when the supplier can keep the program and fixture ready between runs.',
        ],
      },
      {
        buyerAuthor: 'Viktor Sokolov',
        buyerRole: 'Product Engineer',
        buyerDate: '2026-08-14',
        buyerBody: [
          'A supplier suggested enlarging all internal radii on a housing. Our designers resist because the corners look sharper in the CAD model. Is it worth pushing?',
        ],
        expertDate: '2026-08-17',
        expertBody: [
          'If the corners have no functional role, usually yes. A larger radius lets the shop use a bigger, stiffer cutter, run faster and avoid extra operations. The saving can be meaningful on parts with many pockets.',
          'Check mating parts, seals and stress concentration first. If a radius matters for function, keep it and mark it clearly. Otherwise, a consistent radius that matches a standard tool is a low-risk way to reduce cost.',
        ],
      },
      {
        buyerAuthor: 'Leila Haddad',
        buyerRole: 'Operations Manager',
        buyerDate: '2026-08-21',
        buyerBody: [
          'Two suppliers quoted the same drawing, but one is almost 40 percent lower. Should I be worried?',
        ],
        expertDate: '2026-08-24',
        expertBody: [
          'Worry less about the number and more about the explanation. Ask both to list their assumptions on material, setup, tolerance risk, inspection and secondary operations. The lower quote may reflect a more efficient process, or it may leave out something you expect.',
          'Request a sample or a first-article plan before awarding volume. How the supplier handles that stage often tells you more about the total cost than the initial price does.',
        ],
      },
      {
        buyerAuthor: 'Emre Yilmaz',
        buyerRole: 'Manufacturing Engineer',
        buyerDate: '2026-08-28',
        buyerBody: [
          'Should we pay for a dedicated fixture for a part we expect to order two or three times a year?',
        ],
        expertDate: '2026-08-31',
        expertBody: [
          'Estimate the setup time saved per run and the number of runs over the product life. If the fixture shortens setup noticeably and improves repeatability, repeat orders over a few years can recover its cost. Ask who owns it and where it is stored.',
          'If volumes are uncertain, consider a less expensive modular option first. You can invest in a dedicated fixture once the demand pattern is clearer.',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 4. Surface finish, heat treatment and coatings
  // ---------------------------------------------------------------------------
  {
    slug: 'cnc-machined-surface-finish-post-processing-coatings',
    title:
      'CNC Machined Surface Finish and Post-Processing: Roughness, Heat Treatment, Coatings and Dimensional Stability of Precision Parts',
    h1: 'CNC Machined Surface Finish and Post-Processing: Roughness, Heat Treatment, Coatings and Dimensional Stability of Precision Parts',
    previewTitle: 'CNC Surface Finish, Heat Treatment and Coatings',
    previewText:
      'How roughness, heat treatment, anodizing, plating and passivation affect precision CNC parts, and how to keep dimensions stable and finish requirements economical.',
    metaTitle: 'CNC Surface Finish, Heat Treatment and Coatings',
    metaDescription:
      'How surface roughness, heat treatment, anodizing, plating and passivation affect CNC parts, with tips on dimensional stability, masking and finish cost.',
    publishedAt: '2026-09-18',
    image: 'blog-cnc-surface-finish-post-processing.jpg',
    alt: 'Close-up of a precision-machined metal component with a clean finished surface on an industrial inspection bench',
    blogCategorySlugs: ['cnc-precision-machining', 'metalworking-metal-manufacturing'],
    siteCategorySlugs: ['cnc-precision-machining', 'surface-finishing'],
    sections: [
      {
        heading: `Why surface finish and post-processing deserve their own plan`,
        html: `<p>A machined part is rarely finished when it leaves the machine. Many precision components go on to deburring, grinding, heat treatment, anodizing, plating, passivation or painting, and each step can change both the surface and the dimensions that were so carefully cut. A bore that measured perfectly after machining may be a few micrometers undersize after plating, and a flat plate may bow after hardening. If the finishing plan is written after the machining plan, these effects are discovered late, when the only remedies are rework or scrap.</p>
<p>The surface itself also matters beyond appearance. Roughness affects sealing, friction, wear, fatigue behavior, coating adhesion and cleanability. A hydraulic sealing face, a sliding bearing journal and a visible cover panel all need different surfaces, and treating them the same wastes money in one place and risks failure in another.</p>
<p>This article follows a part from the cutting edge through finishing: how roughness is specified and produced, where heat treatment and coatings change the geometry, and how to coordinate machining with outside finishing providers. For the wider sector context, see the overview of <a href="/industrial/metalworking-metal-manufacturing">metalworking and metal manufacturing</a>, and for the specialised process page, see <a href="/industrial/metalworking-metal-manufacturing/cnc-precision-machining">CNC precision machining</a>.</p>`,
      },
      {
        heading: `Roughness parameters: Ra, Rz and what a drawing really asks for`,
        html: `<p>Surface roughness is usually specified with Ra, the arithmetic average of the height deviations of the profile from its mean line. It is simple, widely understood and easy to measure with a stylus profilometer. Its weakness is that it hides the shape of the surface. Two surfaces with the same Ra can behave very differently, one with fine uniform marks and another with a few deep scratches on an otherwise smooth face.</p>
<p>Rz, which is based on the average of the peak-to-valley heights over several sampling lengths, is more sensitive to isolated peaks and valleys. It is often preferred for sealing surfaces and for features where a single deep groove could cause a leak or a crack starter. Other parameters, such as those describing the bearing area or the peak height, exist for lubricated sliding surfaces. Use them only when the function justifies it, because they are rarely needed and not every shop can measure them routinely.</p>
<p>A roughness callout should state the parameter, the value, the measurement direction when it matters, and the surface it applies to. Tier limits by function rather than copying one fine value onto every face. Grinding, honing or lapping can deliver finer surfaces than milling or turning, but the achievable result depends on material, machine and process, so confirm it with the supplier rather than a general chart.</p>`,
      },
      {
        heading: `Cutting parameters, tooling and chatter: how the finish is made`,
        html: `<p>The finish left by milling or turning is a record of the cutting process. Feed per revolution or per tooth, nose radius or cutter geometry, depth of cut, tool wear and rigidity all leave their mark. In turning, the theoretical roughness grows with feed and shrinks with a larger nose radius, which is why finishing passes use a light feed and a suitable insert radius. In milling, step-over and scallop height define the surface between toolpaths, so a finer step-over gives a smoother face at the price of longer cycle time.</p>
<p>Chatter is the main enemy of a clean finish. It is a self-excited vibration between tool and workpiece that leaves regular waves on the surface, shortens tool life and can damage the spindle. It appears with long tool overhang, thin walls, weak workholding or speeds that happen to excite a resonance. Typical remedies are a shorter and stiffer tool, better support under the part, a change in spindle speed, a different tool engagement or a lighter radial cut. A surface with visible chatter may pass a roughness check and still fail on function or appearance.</p>
<p>Tool wear matters as well. A worn edge smears and tears the material rather than cutting it, particularly in soft aluminum and in work-hardening stainless steel. Shops that need a consistent finish plan tool changes by count or time, not only by failure, and inspect the surface on the first and the last parts of a run. Material behavior, covered in the article on <a href="/blog/cnc-precision-machining/cnc-machining-materials-machinability-metal-selection">CNC machining materials and machinability</a>, sets the baseline for what finish is practical.</p>`,
      },
      {
        heading: `Functional and cosmetic surfaces, deburring and grinding`,
        html: `<p>It helps to sort surfaces into functional and cosmetic categories before choosing finish values. Functional surfaces seal, slide, bear load, locate other parts or receive a coating that needs specific preparation. Cosmetic surfaces are seen by customers. Many surfaces are neither, such as internal ribs and hidden faces, and they can often be left as machined with only edges broken. A clear note that identifies the visible faces avoids the temptation to apply premium finishing to the entire part.</p>
<p>Deburring is the most underestimated finishing step. Burrs are created at the end of nearly every cut, and they can scratch mating parts, injure assemblers, shed particles into fluid systems and interfere with fits. Edge condition should be stated, for example a break-edge note with a minimum and maximum size, instead of a vague request to remove all burrs. Methods range from manual work and brushing to thermal, vibratory and abrasive processes. Cross holes and internal intersections are the hardest to reach, so designing them to be accessible saves time.</p>
<p>Grinding enters the plan when a tolerance or a finish cannot be reached by cutting alone, or when a part has been hardened and must be brought back to size. Cylindrical, surface and centerless grinding all remove small amounts of material with high control, leaving fine and consistent surfaces. It is a separate operation with its own setup and inspection, so it adds cost, and the stock left for grinding needs to be planned: too little and distortion cannot be cleaned up, too much and grinding becomes slow and wasteful.</p>`,
      },
      {
        heading: `Heat treatment: hardness gained, dimensions at risk`,
        html: `<p>Heat treatment changes the internal structure of the metal to raise hardness, strength or wear resistance, relieve stress or soften the material. Processes include through hardening, case hardening, tempering, annealing, stress relieving and age hardening of certain aluminum and stainless alloys. These operations are normally carried out by specialized providers with furnaces, controlled atmospheres and quench systems, so they introduce transport, lead time and a second organization into the process.</p>
<p>Distortion is the practical concern. Heating and rapid cooling cause uneven expansion, phase changes and the release of stresses locked into the material. The result may be growth, shrinkage, bowing, twisting or ovality, and the amount depends on geometry, material, quench method and the stress already present from rolling or earlier machining. Parts with asymmetric sections, thin webs next to heavy masses and long slender shapes are the most likely to move. The movement is usually small in absolute terms, but it can be larger than a precision tolerance.</p>
<p>The standard answer is sequence. Rough machine first, leaving finishing stock. Stress relieve if the material and tolerance justify it. Heat treat. Then finish machine or grind the critical features to final size. This is the reason a drawing should state whether a dimension applies before or after heat treatment, and why tight bores in hardened parts are usually finished by grinding, honing or hard turning. Where distortion cannot be tolerated, ask the heat treater about fixturing during quench and about processes with gentler cooling. Planning the allowance with the finisher is cheaper than a trial and error approach.</p>`,
      },
      {
        heading: `Anodizing, plating, passivation and coating thickness against tolerance`,
        html: `<p>Coatings protect the surface, change its appearance or alter its function. Common choices for machined parts include anodizing for aluminum, electroplating and electroless nickel for steel and copper alloys, passivation for stainless steel, black oxide, phosphate and various paint or powder coatings. Each process has its own effect on dimensions and surface condition, and the effect is not always small.</p>
<ul>
<li>Anodizing converts part of the aluminum surface into oxide, so the dimension grows by a fraction of the layer thickness while the rest penetrates the metal. Hard anodizing is thicker than decorative anodizing and affects fits more noticeably. It can also leave sharp edges brittle and cause a slightly rougher surface.</li>
<li>Plating adds material on top of the surface. Thickness may be uneven, building up on outside corners and edges and thinning in recesses, deep holes and internal threads.</li>
<li>Passivation of stainless steel does not add measurable thickness. It removes free iron and supports the natural oxide layer, so surface cleanliness and prior machining contamination matter more than dimensions.</li>
<li>Painting and powder coating add a relatively thick film that can fill small features, interfere with threads and conceal fine detail.</li>
</ul>
<p>Coating thickness ranges vary widely by process and specification class, so confirm them with the finisher before setting machining limits. The key drawing decision is whether a toleranced dimension applies before or after coating. For fits and threads, many designers specify the final dimension after coating and ask the machine shop to leave an allowance on the machined size. Another option is to mask the critical feature so that it receives no coating at all. This keeps the tolerance in the machining step, as discussed in the article on <a href="/blog/cnc-precision-machining/cnc-machining-tolerances-gdt-dimensional-accuracy">CNC machining tolerances and GD&T</a>.</p>
<p>Masking has its own details: which surfaces are masked, with what method, how far the coating may creep at the boundary, and who inspects it. Electrical contact surfaces, press-fit bores, locating pins and threaded holes are typical masking candidates. A drawing that simply says mask critical surfaces without identifying them will lead to questions or, worse, to wrong assumptions.</p>`,
      },
      {
        heading: `Coordinating machining with finishing subcontractors`,
        html: `<p>Many machine shops do not run their own heat treatment or coating lines. They send parts to specialists, which means that the finishing outcome depends on communication across two or more companies. Problems commonly arise at the handoff: the finisher does not know which surfaces are critical, the machine shop does not know the typical growth of the process, or the part arrives with oil, chips or contamination that damage the result.</p>
<p>A short written finishing specification solves most of this. It should list the process and its specification, the thickness or hardness requirement, the surfaces that must be masked, the racking or contact points that are acceptable, the cleanliness requirement on arrival and the inspection that follows. Contact marks from racks should be allowed only on non-critical faces, and the part should have a feature that can serve as a hanging point.</p>
<p>It is also wise to plan for a trial lot on new combinations of material, geometry and finish. A small number of parts can be machined, finished and measured to see how much movement or growth occurs, and the machining allowances can then be adjusted before production. Schedule matters too: outside processes add days or weeks and are often batched by the finisher, so lead time should be agreed at quotation. The quality checks that confirm the result are discussed in the article on <a href="/blog/cnc-precision-machining/cnc-machining-quality-control-cmm-first-article-inspection">CNC machining quality control and inspection</a>.</p>`,
      },
      {
        heading: `The economics of over-specified finish`,
        html: `<p>Finish is an easy place to spend money without benefit. A fine roughness callout can force slower passes, grinding or polishing, tighter tool-life limits and more inspection. A premium coating on every surface adds process cost, masking and lead time. When these notes are copied from an older drawing, they often exceed what the function needs.</p>
<p>Review surfaces one by one. If sealing, fatigue or coating adhesion would suffer from a coarser finish, keep the requirement. If nothing functional changes, relax it. Define visible faces for cosmetic standards and agree a reference sample so inspection stays consistent. Treat finish and tolerance together: a tight size on a rough face is hard to measure, and a fine finish on a loose feature is wasteful. Related cost levers are covered in <a href="/blog/cnc-precision-machining/cnc-machining-cost-optimisation-dfm-batch-size">CNC machining cost optimisation</a>, and finishing-capable shops are mapped under <a href="/industrial/metalworking-metal-manufacturing/cnc-precision-machining">CNC precision machining</a>.</p>`,
      },
    ],
    faq: [
      {
        question: 'What is the difference between Ra and Rz in surface roughness?',
        answer:
          'Ra is the arithmetic average of the surface height deviations, so it describes the general roughness level. Rz is based on peak-to-valley heights over several sampling lengths, so it reacts more strongly to isolated deep marks. Rz is often chosen for sealing surfaces where a single scratch matters. The drawing should name the parameter it uses.',
      },
      {
        question: 'Can heat treatment change the dimensions of a machined part?',
        answer:
          'Yes. Heating and quenching can cause growth, shrinkage, bowing or ovality, especially on asymmetric or thin-walled parts. The usual practice is to rough machine, heat treat and then finish critical features by grinding, honing or hard turning. The drawing should state whether a dimension applies before or after heat treatment.',
      },
      {
        question: 'Does anodizing or plating affect tolerances?',
        answer:
          'Yes. Anodizing grows the dimension by a fraction of the layer thickness, and plating adds material on top of the surface, often unevenly at corners and in recesses. Thickness depends on the process and class, so confirm it with the finisher. Critical fits are often finished after coating or masked to remain uncoated.',
      },
      {
        question: 'What is masking and when is it needed?',
        answer:
          'Masking protects selected areas from a coating or treatment. It is used for press-fit bores, electrical contact faces, locating features and threaded holes where added thickness would cause problems. The drawing should identify the masked surfaces and state how closely the coating boundary must be controlled.',
      },
      {
        question: 'How can I avoid paying for a finish I do not need?',
        answer:
          'Classify each surface as functional, cosmetic or non-critical, and assign the finish requirement accordingly. Identify visible faces, use a general finish note for the rest and ask the supplier which requirements drive cost. A reference sample for cosmetic standards also reduces disputes during inspection.',
      },
    ],
    discussion: [
      {
        buyerAuthor: 'Olumide Adeyemi',
        buyerRole: 'Mechanical Engineer',
        buyerDate: '2026-09-21',
        buyerBody: [
          'Our anodized aluminum housings keep failing the bore diameter check after coating, even though they passed before anodizing. How should we handle this?',
        ],
        expertDate: '2026-09-24',
        expertBody: [
          'Start by clarifying whether the bore tolerance applies before or after anodizing. If it applies after, the machine shop needs to cut the bore to a size that allows for the coating growth, and the finisher should confirm the expected layer for the chosen process.',
          'If the bore is critical, consider masking it or finishing it after coating. A short trial lot, measured both before and after anodizing, usually gives enough data to set the allowance with confidence.',
        ],
      },
      {
        buyerAuthor: 'Sofia Lindqvist',
        buyerRole: 'Quality Manager',
        buyerDate: '2026-09-29',
        buyerBody: [
          'A customer rejected parts for visible tool marks, but our roughness readings were within the drawing limit. What went wrong?',
        ],
        expertDate: '2026-10-02',
        expertBody: [
          'A roughness value describes an average and may not capture a visible pattern such as chatter marks or toolpath scallops. The drawing probably did not define a cosmetic standard for those faces, so the two sides judged by different criteria.',
          'Agree on which faces are visible, what level of marks is acceptable and keep a reference sample. That turns a subjective argument into a comparison that both parties can repeat.',
        ],
      },
      {
        buyerAuthor: 'Rajesh Venkataraman',
        buyerRole: 'Sourcing Lead',
        buyerDate: '2026-10-06',
        buyerBody: [
          'Our machining supplier subcontracts heat treatment and plating, and lead times keep slipping. Can we reduce the risk?',
        ],
        expertDate: '2026-10-09',
        expertBody: [
          'Ask the supplier to show the planned routing with the expected days for each outside process, and agree on which steps can be batched or scheduled in advance. Finishers often run in batches, so a regular release pattern helps more than urgent one-off orders.',
          'It is also reasonable to ask for visibility on the finisher selected and for a written specification that travels with the parts. Clear instructions reduce rework loops, which are the most common cause of slipped delivery.',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 5. Quality control, CMM, FAI
  // ---------------------------------------------------------------------------
  {
    slug: 'cnc-machining-quality-control-cmm-first-article-inspection',
    title:
      'CNC Machining Quality Control and Inspection: CMM Measurement, First Article Inspection, Process Capability and Production Consistency',
    h1: 'CNC Machining Quality Control and Inspection: CMM Measurement, First Article Inspection, Process Capability and Production Consistency',
    previewTitle: 'CNC Quality Control, CMM and First Article Inspection',
    previewText:
      'How CNC shops plan inspection, use CMMs and gauges, run first article inspection and track process capability, and what buyers should ask for to get consistent precision parts.',
    metaTitle: 'CNC Quality Control, CMM and First Article Inspection',
    metaDescription:
      'How CNC machining quality control works: inspection planning, CMM and gauges, first article inspection, SPC and Cpk, Gauge R&R and supplier evaluation.',
    publishedAt: '2026-10-30',
    image: 'blog-cnc-quality-control-inspection.jpg',
    alt: 'Coordinate measuring machine probing a precision-machined metal component in a bright quality-control laboratory',
    blogCategorySlugs: ['cnc-precision-machining', 'metalworking-metal-manufacturing'],
    siteCategorySlugs: ['cnc-precision-machining', 'quality-control'],
    sections: [
      {
        heading: `What quality control means in precision machining`,
        html: `<p>Quality control in a CNC shop is more than checking parts at the end. It is a chain of decisions: which characteristics matter, how they will be measured, when, how often, with what equipment and what happens when a result is out of limits. A part that passes final inspection but was produced by an unstable process may still be a poor purchase, because the next batch could look very different. The aim is not only to find bad parts but to produce consistently good ones.</p>
<p>Inspection and process control complement each other. Inspection reports what happened to a part, and process control uses that information to keep the next part in tolerance. The best shops use both: frequent checks during machining to catch drift early, a thorough check at the start of a job to prove the setup, and a final check that confirms the product against the drawing and the order.</p>
<p>This article describes the main inspection tools and methods, how first article inspection and statistical process control fit together, and what buyers can ask for and evaluate. For the sector as a whole, see the overview of <a href="/industrial/metalworking-metal-manufacturing">metalworking and metal manufacturing</a>, and for the specialised process page, see <a href="/industrial/metalworking-metal-manufacturing/cnc-precision-machining">CNC precision machining</a>.</p>`,
      },
      {
        heading: `Inspection planning: deciding what to measure and how often`,
        html: `<p>A good inspection plan starts from the drawing. The first step is to identify the characteristics that matter, often called critical or key characteristics, and to separate them from features that only need a basic check. A plan then assigns each one a method, a frequency, a record and a reaction. Without that structure, inspection tends either to be sparse and unfocused or to be exhaustive on every dimension, which wastes time.</p>
<p>Typical plan elements include the characteristic and its limits, the measuring method and equipment, the sample size, the point in the process where the check occurs and the form on which the result is recorded. Characteristics with high risk, such as sealing diameters, bearing fits or safety-related features, get tighter control. Dimensions with large tolerances, such as overall lengths on a cast-style housing, can be checked less often.</p>
<p>Planning also covers practicalities that are easy to forget. Can the feature be reached by the probe or gauge? Does the drawing have clear datums that the inspector can establish on a fixture? Will the part be measured at a stable temperature? Is the requirement about the part as machined or after finishing? Asking these questions during the quotation stage avoids surprises at first article inspection, and it connects directly to the datum and tolerance choices described in the article on <a href="/blog/cnc-precision-machining/cnc-machining-tolerances-gdt-dimensional-accuracy">CNC machining tolerances and GD&T</a>.</p>`,
      },
      {
        heading: `Measurement tools: CMM, optical systems, gauges and hand instruments`,
        html: `<p>No single instrument suits every feature, so shops use a mix. Hand tools such as micrometers, calipers, bore gauges and height gauges serve for quick checks at the machine. Fixed gauges, such as go and no-go plug gauges, thread gauges and ring gauges, give fast pass or fail decisions on repetitive features and are valued in higher volumes. Surface roughness testers and profile projectors cover finish and contours.</p>
<p>The coordinate measuring machine, or CMM, is the workhorse for complex geometry. A probe touches the part at many points, and software computes sizes, positions, form and orientation relative to datums defined on the part. This makes it well suited to GD&T features such as position, perpendicularity and profile, which are hard to evaluate with manual tools. A CMM program can be saved and rerun, which supports consistent results across batches, though it takes time to program and fixture, and measurement of one part can take minutes or longer.</p>
<p>Optical and vision systems measure small or delicate features without contact, and laser or structured-light scanners capture whole surfaces for comparison with a model. Each method has limits: optical systems may struggle with shiny or deep features, and scanning accuracy depends on the system and the surface. Many shops also use probes inside the machine tool to check features during machining and to update offsets. The choice of method should follow the tolerance and the feature, not habit.</p>`,
      },
      {
        heading: `Measurement uncertainty, Gauge R&R and calibration`,
        html: `<p>Every measurement has uncertainty, and it comes from the instrument, the operator, the method, the fixture, the temperature and the part itself. If the uncertainty is a large share of the tolerance, the shop cannot reliably tell good parts from bad ones. Parts near the limit may be accepted or rejected by chance, and two laboratories may disagree. Quality systems therefore evaluate the measurement process, not only the part.</p>
<p>Measurement system analysis, or MSA, is the formal approach. A familiar study is the Gauge R&R, in which several operators measure the same set of parts several times. The results separate repeatability, which is the variation when the same person measures the same part again, from reproducibility, which is the variation between operators. The study compares measurement variation with the part variation or with the tolerance and shows whether the gauge is adequate. Many organizations use commonly cited acceptance guidelines, but the right threshold depends on the risk and should be agreed with the customer.</p>
<p>Calibration keeps instruments traceable. Gauges and machines are checked against reference standards at defined intervals, the results are recorded and instruments that fail are removed from use and their earlier results reviewed. Calibration status should be visible on the instrument. A shop that cannot show a calibration record for the equipment used to release parts has a weak basis for its measurements, regardless of how modern the equipment is.</p>`,
      },
      {
        heading: `In-process inspection versus final inspection`,
        html: `<p>Final inspection finds problems after the work is done. In-process inspection finds them while something can still be done. For machined parts, a defect found after a long cycle may mean the cost of the whole cycle, while one found during the first few parts costs very little. This is why shops check the first part of a run, then check at intervals tied to tool life, material changes, shifts or setups.</p>
<p>In-process methods include operator checks at the machine, machine probing to confirm that a feature is in tolerance before the part comes off, tool setting and wear monitoring, and patrol inspection by a quality technician. They work best when the operator has clear limits, an action level before the tolerance limit is reached and authority to stop and adjust. A control limit set inside the tolerance gives time to correct a trend before parts go out of specification.</p>
<p>Final inspection still has a role. It confirms features that cannot be measured during the process, such as dimensions after deburring or coating, appearance, completeness, marking and packaging. It is also the point at which documentation is assembled. The balance between the two depends on risk, volume and the capability of the process, with a stable and proven process requiring less final inspection than a new or marginal one. Finishing effects that can alter final results are covered in the article on <a href="/blog/cnc-precision-machining/cnc-machined-surface-finish-post-processing-coatings">CNC machined surface finish and post-processing</a>.</p>`,
      },
      {
        heading: `First article inspection: proving the process before production`,
        html: `<p>First article inspection, often abbreviated FAI, is a complete and documented verification of the first parts produced from a new setup, a new program or a revised design. It confirms that the supplier understood the drawing, that the process can produce parts to it and that the measuring methods are in place. The report typically lists each drawing characteristic, the requirement, the measured result and whether it conforms, along with material and process records where required.</p>
<p>A common practice is to number every dimension and note on the drawing, a so-called ballooned drawing, and to match each balloon to a line in the report. This makes it easy to see that nothing was skipped and gives the customer a clear picture. Some industries have formal FAI requirements and report formats, and the customer should specify which one applies, if any, when the order is placed, instead of requesting a report afterward.</p>
<p>FAI is not a one-time formality. It should be repeated when something significant changes: a new machine, a new fixture, a program revision, a different material source, a change in subcontractor or a drawing revision. Approval before volume production lets the customer and the supplier correct misunderstandings while quantities are small. Skipping it to save time often costs more later, when a whole batch has been made to a mistaken interpretation.</p>`,
      },
      {
        heading: `Process capability and SPC: Cp and Cpk in practice`,
        html: `<p>Statistical process control, or SPC, uses measurement data to understand how a process behaves over time. Instead of asking only whether a part is in tolerance, it asks how much of the tolerance band the process uses and whether it is stable. Control charts plot results from sampled parts and show trends, shifts and unusual points before they cause defects.</p>
<p>Two common indices summarize capability. Cp compares the width of the tolerance with the spread of the process, and it describes the potential if the process were perfectly centered. Cpk also considers how well the process is centered between the limits, so it is lower when the average drifts toward one side. A higher index means more margin. Many customers cite a minimum Cpk for critical characteristics, with 1.33 a commonly cited reference, but the number should be agreed for each program and applied to the characteristics that justify it.</p>
<p>These indices are only meaningful when the process is stable and the data are reliable. They require enough measurements, a good measurement system and an understanding of how the sample was taken. A single capability number from a short run of consecutive parts says little about long-term behavior. Capability studies are useful when launching production and for monitoring the few key characteristics that matter most, but applying them to every dimension is rarely worth the effort.</p>`,
      },
      {
        heading: `Documentation, nonconformance and supplier evaluation`,
        html: `<p>Documentation shows quality to someone who was not in the shop. Tier it by risk: certificate of conformance for routine parts; material certificates where properties matter; first article with a ballooned drawing for new or changed processes; inspection data on critical characteristics; and special-process records for heat treatment or coating. State the package on the purchase order so the supplier can price it.</p>
<p>When a characteristic fails, contain the lot, record the disposition and find the root cause. Weak corrective actions say “be more careful.” Strong ones change tooling rules, programs, fixtures or the inspection plan, then verify the fix. Traceability depth should match the application.</p>
<p>When evaluating suppliers, ask for a sample FAI, how methods are verified, how nonconformances are handled and how drawing revisions reach the floor. Certificates help, but they do not replace a look at real measurement practice. Start comparisons from the <a href="/industrial/metalworking-metal-manufacturing/cnc-precision-machining">CNC precision machining</a> overview, and keep the parent <a href="/industrial/metalworking-metal-manufacturing">metalworking and metal manufacturing</a> page in view when the bill of materials mixes machined and other metal parts.</p>`,
      },
      {
        heading: `The economics of over-inspection`,
        html: `<p>Inspection costs money. Measuring every feature on every part and attaching unread reports raises price and lead time. That may be justified for safety-critical characteristics. For a stable process on a simple part, it is often waste. Too little inspection is also expensive once defects reach the customer as sorting, returns and lost trust.</p>
<p>Match effort to risk: full FAI and tighter sampling on a new part, then reduce frequency as capability and delivery history build confidence, while keeping control on critical features. Define what returns the plan to a tighter level after a process change or nonconformance. Clearing unnecessary tight limits on the drawing also reduces metrology load, as discussed in <a href="/blog/cnc-precision-machining/cnc-machining-cost-optimisation-dfm-batch-size">CNC machining cost optimisation</a>.</p>`,
      },
    ],
    faq: [
      {
        question: 'What is first article inspection in CNC machining?',
        answer:
          'First article inspection is a complete, documented check of the first parts made from a new setup, program or drawing revision. Every drawing requirement is measured and recorded, so the buyer and supplier can confirm that the process produces conforming parts before volume production starts.',
      },
      {
        question: 'When is a CMM better than hand gauges?',
        answer:
          'A CMM is better for complex geometry and GD&T features such as position, profile and perpendicularity to datums. Hand gauges and fixed gauges are faster for simple sizes and repetitive checks at the machine. Most shops use both, selecting the method according to the tolerance and the feature.',
      },
      {
        question: 'What do Cp and Cpk tell me about a machining process?',
        answer:
          'Cp compares the tolerance width with the process spread, while Cpk also accounts for how well the process is centered within the limits. Higher values mean more margin. They are only meaningful when the process is stable and the measurement system is reliable, and they are best applied to critical characteristics.',
      },
      {
        question: 'What is Gauge R&R and why does it matter?',
        answer:
          'Gauge R&R is a study that measures how much variation comes from the measuring system, split into repeatability and reproducibility. It shows whether the gauge and method can distinguish good parts from bad ones at the tolerance in question. Without it, measurement error may be mistaken for part variation.',
      },
      {
        question: 'What documents should I ask for with precision CNC parts?',
        answer:
          'It depends on risk. Typical options are a certificate of conformance, material certificates, a first article report with a ballooned drawing, inspection data on critical characteristics, special process records and capability data. State the requirements on the purchase order so that the supplier can price and plan them.',
      },
    ],
    discussion: [
      {
        buyerAuthor: 'Camille Fontaine',
        buyerRole: 'Supplier Quality Engineer',
        buyerDate: '2026-11-02',
        buyerBody: [
          'A supplier sends full CMM reports with every shipment, but our incoming results sometimes differ. How do we resolve the discrepancy?',
        ],
        expertDate: '2026-11-03',
        expertBody: [
          'Begin by comparing the datum setup, fixturing and probing strategy used by both sides. Differences in how the part is located explain a large share of disagreements. Temperature and the condition of the part, for example before or after finishing, also matter.',
          'Then measure the same parts together or exchange a reference part. Once you agree on the method, record it in the quality agreement so that future reports are comparable.',
        ],
      },
      {
        buyerAuthor: 'Dmitri Kovalenko',
        buyerRole: 'Operations Director',
        buyerDate: '2026-11-04',
        buyerBody: [
          'We require 100 percent inspection of every dimension from all suppliers, and costs are rising. Is that sensible?',
        ],
        expertDate: '2026-11-05',
        expertBody: [
          'It may be justified for a handful of critical characteristics, but applying it to everything is rarely efficient. A tiered plan usually works better: full inspection on first articles, controlled sampling for stable processes and tighter checks on safety or function-critical features.',
          'Support the change with data. If a supplier shows stable capability and a clean delivery history, reducing the inspection load on non-critical features is reasonable, with a clear rule for returning to tighter control after a problem.',
        ],
      },
      {
        buyerAuthor: 'Mei-Ling Chen',
        buyerRole: 'Product Manager',
        buyerDate: '2026-11-06',
        buyerBody: [
          'What is a reasonable way to check that a new machining supplier is serious about quality before we place a large order?',
        ],
        expertDate: '2026-11-09',
        expertBody: [
          'Place a small pilot order with a full first article report and review it carefully. Look at how clearly the report maps to the drawing, whether instruments and calibration are identified and how the supplier responds to questions or findings.',
          'If possible, visit or hold a video walkthrough of the inspection area. Ask for an example of a corrective action. The way a supplier discusses a past problem tells you a lot about how it will handle a future one.',
        ],
      },
      {
        buyerAuthor: 'Andres Castellanos',
        buyerRole: 'Manufacturing Quality Lead',
        buyerDate: '2026-11-10',
        buyerBody: [
          'Our process shows a good Cpk on a bore diameter, but we still see occasional rejects. How can that be?',
        ],
        expertDate: '2026-11-12',
        expertBody: [
          'A good index on one characteristic does not guarantee that every cause of rejection is covered. Check whether the data came from a short run, whether the measurement system is adequate and whether the rejects are in a different characteristic, such as form or position, than the one studied.',
          'Also review sudden events that a capability study can hide, such as a tool breakage, a material lot change or a handling problem. Control charts over a longer period, combined with a review of the reject records, usually point to the cause.',
        ],
      },
    ],
  },
]
