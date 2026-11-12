export type MetalArticle = {
  slug: string
  title: string
  h1: string // postLongTitle, can equal title or be slightly longer
  previewTitle: string
  previewText: string
  metaTitle: string // 50-60 chars
  metaDescription: string // 140-160 chars
  publishedAt: string // ISO dates in May, Jun, Jul, Sep, Oct 2026 (5 different months)
  image: string // filename in public/media
  alt: string
  blogCategorySlugs: string[] // primary first
  siteCategorySlugs: string[]
  sections: { heading: string; html: string }[] // html is paragraphs/lists only, may include <a href="/industrial/...">
  faq: { question: string; answer: string }[] // 4-6 each
  discussion: {
    buyerAuthor: string
    buyerRole: string
    buyerDate: string
    buyerBody: string[]
    expertDate: string
    expertBody: string[]
  }[] // 2-3 exchanges
}

export const METALWORKING_ARTICLES: MetalArticle[] = [
  // ---------------------------------------------------------------------------
  // 1. Metal fabrication processes
  // ---------------------------------------------------------------------------
  {
    slug: 'metal-fabrication-processes-capabilities-applications',
    title: 'Metal Fabrication: Processes, Capabilities and Applications in Modern Manufacturing',
    h1: 'Metal Fabrication: Processes, Capabilities and Applications in Modern Manufacturing',
    previewTitle: 'Metal Fabrication: Processes, Capabilities and Applications',
    previewText:
      'A practical guide to cutting, forming, welding and finishing, with notes on materials, tolerances and the information a fabricator needs to quote your part.',
    metaTitle: 'Metal Fabrication Processes, Capabilities and Uses',
    metaDescription:
      'How metal fabrication works: laser cutting, bending, welding and finishing, what each process can hold, and what buyers should send with an enquiry.',
    publishedAt: '2026-05-20',
    image: 'blog-metal-fabrication-processes.jpg',
    alt: 'Fabricated steel parts being cut, bent and welded in a metal fabrication workshop',
    blogCategorySlugs: ['metalworking-metal-manufacturing', 'metal-fabrication'],
    siteCategorySlugs: ['metal-fabrication', 'metal-alloys'],
    sections: [
      {
        heading: 'What metal fabrication means in production terms',
        html: `<p>Metal fabrication is the making of parts, assemblies and structures from sheet, plate, bar, tube and profile by cutting, forming, joining and finishing. It differs from casting, where molten metal is poured into a mould, and from machining, where most of the shape is produced by removing material from a solid block. A fabricated part usually starts as flat or linear stock that is cut to a pattern, bent or rolled to shape, welded or fastened to its neighbours, and then cleaned and coated.</p>
<p>Many real parts combine these routes. A welded machine frame may carry machined bearing seats, and a sheet metal enclosure may include a cast hinge. For that reason the first useful question for a buyer is not "who fabricates?" but "which operations does this supplier run under its own roof, and which does it send out?" This guide gives engineers and procurement teams a working view of <a href="/industrial/metalworking-metal-manufacturing">metal fabrication and manufacturing processes</a>: how the steps connect, what each one can realistically hold, and what a supplier needs in order to quote with confidence.</p>
<p>If you want the supplier-side description of this work, the <a href="/industrial/metalworking-metal-manufacturing/metal-fabrication">metal fabrication</a> page sets out how fabricators describe their capabilities to buyers.</p>`,
      },
      {
        heading: 'Cutting: laser, plasma, waterjet and sawing',
        html: `<p>Cutting is normally the first value-adding step, and the method chosen sets the edge quality, the heat input and the cost per part. The common options are:</p>
<ul>
<li>Fibre laser cutting, which suits thin to medium sheet and delivers narrow kerf, clean edges and fine detail. On mild steel, stainless steel and aluminium, achievable cut thickness depends mainly on machine power. Shops often quote positional tolerances on thin sheet in the region of a tenth of a millimetre, but part size, nesting and thermal movement all affect what can be held on a given job.</li>
<li>Plasma cutting, which is faster and cheaper on thick plate but leaves a wider kerf, a more noticeable bevel and a larger heat-affected zone. It is a sensible choice for structural plate that will be welded or machined afterwards.</li>
<li>Waterjet cutting, which uses no heat and so avoids hardening or distortion at the edge. It handles thick sections and mixed materials but runs more slowly.</li>
<li>Band and cold saw cutting for bar, tube and profile, where length accuracy and square ends matter more than contour.</li>
</ul>
<p>Where the part is a flat profile with holes, slots and tabs, the dedicated <a href="/industrial/metalworking-metal-manufacturing/laser-manufacturing">laser cutting and laser manufacturing</a> page is the natural place to compare machine capacity and material range.</p>`,
      },
      {
        heading: 'Forming: press brake bending, rolling and punching',
        html: `<p>Forming turns flat blanks into three-dimensional shapes. Press brake bending is the workhorse for brackets, enclosures, channels and panels. The designer controls the result through bend radius, material thickness, flange length and the direction of the rolling grain in the sheet. A tight inside radius on a hard or thick material can crack the outer surface, and a very short flange cannot be held reliably by the tooling.</p>
<p>Springback is the other factor that surprises first-time buyers. Metal returns slightly towards its original shape after bending, and the amount varies between steel, stainless steel and aluminium alloys. An experienced fabricator compensates by over-bending and by checking the first part on a protractor or a coordinate gauge before releasing the batch.</p>
<p>Plate rolling produces cylinders and cones for tanks, hoppers and guards. Punching and turret machines create holes, louvres and embossed features at high speed when volumes justify the tooling. The <a href="/industrial/metalworking-metal-manufacturing/sheet-metal-metal-forming">sheet metal and metal forming</a> page covers these operations in more depth.</p>`,
      },
      {
        heading: 'Joining: welding, fastening and assembly',
        html: `<p>Joining converts separate cut and formed pieces into one working assembly. Arc welding processes such as MIG/MAG and TIG are the most common, with spot welding used on thin sheet overlaps and laser welding where a narrow seam and low distortion are needed. Weld size, joint preparation and the sequence of passes are all decisions that affect strength, appearance and the amount of straightening needed afterwards.</p>
<p>Distortion is the practical enemy. Heat from welding shrinks the metal as it cools, and long or asymmetric welds can pull a frame out of square. Fabricators manage this with fixtures, tack-welding plans, balanced weld sequences and, on larger work, machining after welding. Mechanical fastening is the alternative: bolts, rivets, self-clinching inserts and threaded studs allow disassembly and avoid heat altogether.</p>
<p>For loaded structures, pressure parts and thick sections, the work moves into <a href="/industrial/metalworking-metal-manufacturing/welding-heavy-fabrication">welding and heavy fabrication</a>, where welding procedures, qualified welders and inspection records usually form part of the contract.</p>`,
      },
      {
        heading: 'Machining, heat treatment and finishing inside a fabrication route',
        html: `<p>Welded structures rarely hold final tolerances on their own. Where bores, faces and mounting surfaces must be accurate, the fabricated assembly is machined after welding, often following a stress-relief step so that the part does not move once material is removed. This is a standard route for machine bases, gearbox housings and support frames.</p>
<p>Finishing protects the part and defines how it looks in service. The typical choices are:</p>
<ul>
<li>Powder coating or wet paint on carbon steel for indoor and general outdoor use.</li>
<li>Hot-dip galvanising for structures exposed to weather, where coating thickness and the effect on fit must be planned in advance.</li>
<li>Anodising on aluminium for corrosion resistance and a controlled surface.</li>
<li>Pickling and passivation on stainless steel to restore the protective oxide layer after welding.</li>
</ul>
<p>Masking of threads and fitted surfaces should be shown on the drawing, otherwise coating can make a hole or a thread unusable. Surface options are described on the <a href="/industrial/metalworking-metal-manufacturing/surface-finishing-coatings">surface finishing and coatings</a> page.</p>`,
      },
      {
        heading: 'Materials and how they change the process',
        html: `<p>The material choice shapes every earlier decision. Carbon and low-alloy steels are the default for frames and general parts: they cut, bend and weld readily and cost less than most alternatives, but they need a coating. Austenitic stainless steels, such as grades 304 and 316, resist corrosion and suit food, chemical and medical equipment, but they work-harden, spring back more and need careful heat control to avoid discolouration and loss of corrosion resistance at the weld.</p>
<p>Aluminium alloys are light and easy to form in softer tempers, yet they conduct heat quickly, so welding needs more skill and more energy, and the heat-affected zone can be weaker than the parent metal. Copper and brass appear in electrical and thermal parts and bring their own cutting and welding limits.</p>
<p>For anything beyond routine stock, ask for the material specification on the drawing and a mill test certificate with the delivery. This is the point at which buyers working across several grades should look at how <a href="/industrial/metalworking-metal-manufacturing">metal fabrication and manufacturing processes</a> change with alloy, because a part drawn in one grade cannot always be switched to another without changing the route.</p>`,
      },
      {
        heading: 'Where fabricated parts are used',
        html: `<p>Fabrication serves almost every industrial sector because it adapts quickly to low and medium volumes and to large sizes that casting or forging cannot economically match. Typical applications include:</p>
<ul>
<li>Machinery builders: frames, guards, covers, hoppers, conveyor structures and machine bases.</li>
<li>Energy and process plant: tanks, skids, pipe supports, access platforms and control cabinets.</li>
<li>Construction and infrastructure: stairs, handrails, brackets, cladding supports and miscellaneous steelwork.</li>
<li>Food, pharmaceutical and medical equipment: stainless steel tables, vessels, housings and hygienic enclosures.</li>
<li>Transport and agricultural equipment: chassis parts, body frames, tool carriers and implements.</li>
<li>Electrical and electronics: switchgear enclosures, racks and chassis.</li>
</ul>
<p>Each of these sectors brings its own expectations on documentation, finish and inspection, so a supplier strong in one area is not automatically the right choice for another.</p>`,
      },
      {
        heading: 'Prototype, batch and series: how volume changes the route',
        html: `<p>A one-off prototype and a series of five thousand brackets may share a drawing but not a process plan. For a prototype, the fabricator will usually cut on a laser, bend with standard tooling and weld without dedicated fixtures. The unit price is high because setup, programming and first-part checks are spread across a single piece.</p>
<p>In batch production, nesting software arranges parts on the sheet to reduce scrap, bending sequences are stored, and simple welding fixtures hold components in position. At series volumes, it often pays to invest in dedicated tooling, automated loading, robotic welding cells and in-line inspection gauges. The cost of that investment is recovered across the run, and repeatability improves as a result.</p>
<p>Buyers should state the annual volume, the batch size and the expected number of repeat orders in the enquiry. Without those figures, a fabricator has to guess, and the quote either ignores an opportunity to save money or hides a tooling charge that appears later.</p>`,
      },
      {
        heading: 'What to send with an enquiry',
        html: `<p>A complete enquiry shortens quoting time and reduces back-and-forth. At a minimum, send:</p>
<ul>
<li>A 2D drawing with dimensions, tolerances, material and surface treatment, plus a 3D model (STEP is widely accepted) for cutting programs.</li>
<li>Material grade and thickness, and whether certificates are required.</li>
<li>Welding requirements, including weld sizes, weld symbols and any inspection or testing that applies.</li>
<li>Finishing requirements, including colour, coating thickness and areas to mask.</li>
<li>Quantities, delivery schedule and packaging needs.</li>
<li>Any applicable specification, customer standard or industry code.</li>
</ul>
<p>Mark the critical dimensions and the surfaces that matter, and leave the rest on general tolerances. A drawing that holds every feature to a tight tolerance costs more and gives the supplier no guidance about what the part really needs.</p>`,
      },
    ],
    faq: [
      {
        question: 'What is the difference between metal fabrication and machining?',
        answer:
          'Fabrication builds parts from sheet, plate, tube and profile by cutting, forming and joining. Machining removes material from a solid block or bar with cutting tools. Many products use both, for example a welded frame with machined mounting faces.',
      },
      {
        question: 'How accurate is laser cutting on sheet metal?',
        answer:
          'On thin sheet, fibre laser cutting can hold tight positional tolerances, often discussed in tenths of a millimetre. The result depends on material, thickness, part size and how the sheet is supported, so the supplier should confirm the figure for your part.',
      },
      {
        question: 'Which finish should I choose for a steel fabrication used outdoors?',
        answer:
          'Hot-dip galvanising, or a coating system suited to the exposure class, is common for outdoor steelwork. The right choice depends on location, expected service life and appearance, and it should be agreed with the coating supplier before fabrication starts.',
      },
      {
        question: 'Do I need a 3D model as well as a drawing?',
        answer:
          'A drawing defines tolerances, materials and finishing, while a 3D model such as a STEP file lets the supplier program cutting and bending quickly. Sending both usually shortens quoting and reduces interpretation errors.',
      },
      {
        question: 'How does order quantity affect the price per part?',
        answer:
          'Setup, programming and first-part checks are fixed costs, so they weigh heavily on prototypes and shrink per part as quantity rises. Larger runs may also justify fixtures, nesting optimisation and automation that lower the unit cost further.',
      },
    ],
    discussion: [
      {
        buyerAuthor: 'Industrial buyer',
        buyerRole: 'Procurement lead, machinery sector',
        buyerDate: '2026-05-27',
        buyerBody: [
          'We buy welded sheet metal frames with a few machined faces. Is it better to find one supplier that does everything, or to split cutting, welding and machining between specialists?',
        ],
        expertDate: '2026-05-28',
        expertBody: [
          'A single supplier is usually simpler when the machined faces depend on the welded geometry, because one party owns the flatness and position of the finished part. Splitting the work makes sense when one operation needs equipment or approvals the others lack.',
          'If you do split, define the datum scheme clearly on the drawing, agree who checks what, and plan a stress-relief step before machining. The most common problem is a welded frame that moves after it leaves the welder.',
        ],
      },
      {
        buyerAuthor: 'Manufacturing buyer',
        buyerRole: 'Sourcing engineer',
        buyerDate: '2026-06-03',
        buyerBody: [
          'Our stainless parts sometimes show discolouration along the welds. Is that a cosmetic issue or a corrosion risk?',
        ],
        expertDate: '2026-06-04',
        expertBody: [
          'Heavy heat tint on stainless steel can mean the protective oxide layer is damaged near the weld, so it can be more than cosmetic, particularly in wet, salty or chemical environments. Pickling and passivation after welding restores the surface.',
          'Ask the supplier how they control heat input and shielding gas, and state in the order whether welds must be cleaned and passivated. For food or medical equipment, also specify the surface finish you expect on visible welds.',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 2. Metal structures manufacturing
  // ---------------------------------------------------------------------------
  {
    slug: 'metal-structures-manufacturing-engineering-to-finished',
    title: 'Metal Structures Manufacturing: From Engineering Drawings to Finished Structures',
    h1: 'Metal Structures Manufacturing: From Engineering Drawings to Finished Structures',
    previewTitle: 'Metal Structures Manufacturing: From Drawings to Finished Structures',
    previewText:
      'Follow a steel or aluminium structure through each stage of manufacture, from the engineering package to trial assembly, and see where delays and rework usually start.',
    metaTitle: 'Metal Structures Manufacturing: Drawings to Delivery',
    metaDescription:
      'Follow metal structures manufacturing from engineering drawings through fabrication, welding, inspection and delivery, and learn where rework and delay begin.',
    publishedAt: '2026-06-18',
    image: 'blog-metal-structures-manufacturing.jpg',
    alt: 'Welded steel structure assembled in a fabrication shop from engineering drawings',
    blogCategorySlugs: ['metalworking-metal-manufacturing', 'metal-fabrication'],
    siteCategorySlugs: ['structural-welding', 'industrial-welding'],
    sections: [
      {
        heading: 'Stage 1: Reading the engineering package',
        html: `<p>A metal structure is only as good as the information the shop receives. The engineering package normally contains general arrangement drawings, member and connection details, material specifications, weld requirements, surface treatment and any applicable standard. Before quoting, an experienced fabricator reads the package for gaps: undefined weld sizes, missing hole positions, conflicting revisions and connection types that cannot be built as drawn.</p>
<p>This review matters because design intent and shop reality do not always match. A connection that looks simple on a model may require a welder to reach a place that a torch cannot access, or a beam to be lifted into a position the crane cannot manage. Questions raised at this stage cost a phone call. Questions raised after steel is cut cost material and time.</p>
<p>Buyers who work with <a href="/industrial/metalworking-metal-manufacturing">industrial metal manufacturing</a> suppliers should ask for a written list of queries and assumptions with the quote, so that both sides start with the same understanding of scope.</p>`,
      },
      {
        heading: 'Stage 2: Shop drawings and material take-off',
        html: `<p>Engineering drawings describe the structure. Shop drawings, sometimes called fabrication drawings, describe how each piece is made. They give every part a mark number, a cut length, hole sizes and edge preparation, and show how parts combine into sub-assemblies. A material take-off then lists the sections, plates and fasteners to be bought, usually with an allowance for offcuts and for plate nesting.</p>
<p>Good shop drawings reduce the number of decisions made at the bench. Poor ones push those decisions to welders and fitters, who then make assumptions that nobody has approved. On larger projects, shop drawings are often submitted to the designer for approval before cutting begins, and the approval date is a real milestone in the programme.</p>
<ul>
<li>Check that part marks are unique and match the assembly drawing.</li>
<li>Check that weld symbols state size, length and process where it matters.</li>
<li>Confirm hole types and tolerances for bolted connections.</li>
<li>Confirm how large assemblies will be split for transport.</li>
</ul>`,
      },
      {
        heading: 'Stage 3: Material procurement and traceability',
        html: `<p>Steel for structural work is bought to a specified grade and delivered with inspection documents that relate the batch to its chemical and mechanical properties. When a project requires traceability, each piece carries a heat or batch number through cutting, so that a finished member can be linked back to its certificate. Marking practices such as stamping, paint or tagging must survive cutting and welding, or the link is lost.</p>
<p>Lead times for plate, rolled sections and special grades vary with the market, and a missing material can hold up the whole project. Procurement should confirm availability early, agree acceptable substitutions in writing, and check that delivered material matches the order before it enters the shop.</p>
<p>Where the structure includes stainless steel or aluminium, store these materials away from carbon steel to prevent contamination, and use dedicated tools. This simple discipline protects corrosion resistance and avoids later disputes about surface condition.</p>`,
      },
      {
        heading: 'Stage 4: Cutting, preparation and fit-up',
        html: `<p>Plate parts are normally cut by plasma, laser or oxy-fuel depending on thickness, while sections are sawn, drilled and sometimes coped to fit each other. Weld edges are prepared by bevelling or grinding where the joint design requires full penetration. Accuracy at this stage controls what happens at fit-up: gaps that are too wide force extra weld metal, add distortion and weaken the joint.</p>
<p>Fit-up means assembling the cut parts in their final position and holding them there, usually with jigs, clamps and tack welds, before the main welds are made. The fitter checks squareness, length, diagonals and alignment against the drawing. A few minutes spent correcting a gap at this point prevents hours of repair later.</p>
<p>On large work, fabricators build the structure on a levelled bed or in a purpose-made fixture so that the geometry is set by the tooling and not by the skill of an individual. For heavy sections this preparation is part of <a href="/industrial/metalworking-metal-manufacturing/welding-heavy-fabrication">welding and heavy fabrication</a>.</p>`,
      },
      {
        heading: 'Stage 5: Welding sequence and distortion control',
        html: `<p>Welding is where most structural quality problems originate, and where good planning pays the most. A written welding procedure defines the process, consumables, joint preparation, preheat where needed, interpass temperature and the range of parameters. Welders work to that procedure and, depending on the project, hold qualifications for the processes and positions they use.</p>
<p>The weld sequence matters as much as the weld itself. Welding all on one side pulls a member in one direction, so fabricators alternate sides, use back-stepping and balance the heat input. Rigid fixtures hold shape but can lock in stress, so some work is released from fixtures only when cool.</p>
<ul>
<li>Control heat input to limit distortion and protect material properties.</li>
<li>Keep consumables dry and identified, particularly low-hydrogen electrodes.</li>
<li>Record who welded what, when, and to which procedure, if the project calls for it.</li>
<li>Inspect welds visually as work proceeds, not only at the end.</li>
</ul>`,
      },
      {
        heading: 'Stage 6: Dimensional checks, machining and surface treatment',
        html: `<p>After welding, the structure is measured against the drawing. Tape and level checks are enough for many frames, while precision structures may need laser trackers or coordinate measuring arms. Where the design needs accurate bores or faces, such as a bearing seat or a mounting plate, the assembly goes to a machining centre or a floor-type boring mill after stress relief.</p>
<p>Surface treatment follows. Blasting removes mill scale and rust and gives the coating a profile to grip. Paint systems, galvanising and metallic coatings each have their own preparation, thickness and curing requirements, and the specification should name the system, the thickness and the areas to leave bare. Galvanising in particular needs vent and drain holes in hollow sections and affects dimensional fit, so it must be planned during design and not discovered at the bath.</p>
<p>Record dimensions and coating thicknesses on the inspection report, because these are the figures that settle disagreements after delivery.</p>`,
      },
      {
        heading: 'Stage 7: Trial assembly, packing and delivery',
        html: `<p>For structures that will be bolted together on site, a trial assembly in the shop is a cheap way to find hole mismatches and interface errors. It is not always required, but on complex or critical structures it frequently saves far more than it costs. Each piece is marked with its position, and match marks help the erection crew.</p>
<p>Packing and transport deserve planning of their own. Long members need supports that prevent bending and damage to coatings, and loose fasteners should be bagged, labelled and counted. Transport limits on width, height and weight determine how a structure is split into shipping units, and that split should be decided during the shop drawing stage, not at the loading bay.</p>
<p>A final documentation pack normally accompanies delivery. Depending on the contract, it may include material certificates, welding records, inspection reports, coating records and a dimensional survey.</p>`,
      },
      {
        heading: 'Where delay and rework usually start',
        html: `<p>Looking across projects, the same few causes repeat. Late or changing drawings are first: revisions that arrive after cutting has begun mean scrap and reprogramming. Unclear scope comes second, especially around who supplies fasteners, coatings or temporary supports. Third is the mismatch between design and workshop practice, such as connections that cannot be welded in position or members that cannot be handled safely.</p>
<p>Standards also create surprises when they are discovered late. Where a project requires an execution standard such as EN 1090 for structural steelwork, or another code for the market and application, the requirement should be stated at enquiry. The supplier then knows whether its factory production control, welding coordination and documentation already meet it. What a project needs depends on the product, the industry and the place of use, and nobody should assume a universal requirement.</p>
<p>A short pre-production meeting between the designer, the fabricator and the buyer, held before cutting, resolves many of these points and sets out inspection hold points, delivery dates and the revision control method.</p>`,
      },
    ],
    faq: [
      {
        question: 'What is the difference between engineering drawings and shop drawings?',
        answer:
          'Engineering drawings show the design: geometry, loads, materials and connections. Shop drawings translate that design into manufacturing information, with part marks, cut lengths, hole positions, weld details and assembly sequences for each piece.',
      },
      {
        question: 'Why does welded steelwork distort, and how is it controlled?',
        answer:
          'Weld metal shrinks as it cools and pulls the surrounding steel with it. Fabricators control distortion through fixtures, balanced weld sequences, limited heat input and, where needed, straightening or machining after welding.',
      },
      {
        question: 'Do all metal structures need a trial assembly?',
        answer:
          'No. A trial assembly is most useful for complex, bolted or critical structures where hole matching and interfaces are hard to check on paper. Simple structures often skip it, and the decision should be agreed in the order.',
      },
      {
        question: 'What documents should I expect with a finished structure?',
        answer:
          'That depends on the contract. Common items include material certificates, welding and inspection records, coating thickness reports and a dimensional survey. State your documentation needs at enquiry so the supplier can price and plan them.',
      },
      {
        question: 'When should galvanising be considered in the design?',
        answer:
          'During design, before fabrication drawings are issued. Hollow sections need vent and drain holes, the size of the bath limits the piece length, and the coating adds thickness that can affect fits and threads.',
      },
    ],
    discussion: [
      {
        buyerAuthor: 'Manufacturing buyer',
        buyerRole: 'Project purchasing manager',
        buyerDate: '2026-06-24',
        buyerBody: [
          'Our designer issues drawing revisions regularly while fabrication is already underway. How can we avoid paying for scrapped steel?',
        ],
        expertDate: '2026-06-25',
        expertBody: [
          'Agree a release process before cutting starts. Mark drawings as released for fabrication only when the design is stable, and let the supplier confirm in writing which revision it works to.',
          'It also helps to separate long-lead material from detail that may change. Plate and sections can be ordered early, while cutting of the most uncertain parts waits for a final revision. Any change after release should carry an agreed cost and time impact.',
        ],
      },
      {
        buyerAuthor: 'Industrial buyer',
        buyerRole: 'Sourcing engineer',
        buyerDate: '2026-07-02',
        buyerBody: [
          'Is it normal for a fabricator to ask for approval of shop drawings before starting work? It seems to add time.',
        ],
        expertDate: '2026-07-03',
        expertBody: [
          'Yes, it is common on structural and heavy work. The approval step adds a short delay at the start, but it catches interpretation errors while they are still a drawing change.',
          'To keep the schedule, set a response time for approvals when you place the order, and name one person on the buyer side who can approve or comment quickly.',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 3. CNC machining and precision metalworking
  // ---------------------------------------------------------------------------
  {
    slug: 'cnc-machining-precision-metalworking-requirements',
    title: 'CNC Machining and Precision Metalworking: Processes, Accuracy and Production Requirements',
    h1: 'CNC Machining and Precision Metalworking: Processes, Accuracy and Production Requirements',
    previewTitle: 'CNC Machining and Precision Metalworking',
    previewText:
      'What CNC machining can hold, which machines suit which parts, and how drawings, materials, workholding and inspection decide accuracy and cost.',
    metaTitle: 'CNC Machining and Precision Metalworking Explained',
    metaDescription:
      'Learn how CNC machining works, which tolerances are realistic, how materials and setups affect accuracy, and what to put on a drawing for a clear quote.',
    publishedAt: '2026-07-24',
    image: 'blog-cnc-precision-metalworking.jpg',
    alt: 'CNC machining centre cutting a precision metal component',
    blogCategorySlugs: ['metalworking-metal-manufacturing', 'cnc-machining'],
    siteCategorySlugs: ['cnc-machining', 'precision-machining-cnc-advanced-machining'],
    sections: [
      {
        heading: 'What does CNC machining actually produce?',
        html: `<p>Computer numerical control (CNC) machining removes material from a solid workpiece using cutting tools that follow a programmed path. The raw material is usually bar, plate, forging or casting, and the output is a part with defined dimensions, surfaces and features such as holes, threads, pockets and profiles. Because the process is subtractive and driven by a program, it suits parts that need accuracy, repeatability and good surface quality.</p>
<p>Precision metalworking is a broader term. It includes CNC milling and turning, but also grinding, wire and sinker electrical discharge machining (EDM), honing, lapping and measurement under controlled conditions. A supplier described as precise is not only one with accurate machines, but one that controls temperature, tooling, process stability and inspection.</p>
<p>For a view of how machining fits among the other <a href="/industrial/metalworking-metal-manufacturing">metalworking capabilities</a>, such as fabrication, casting and heat treatment, it helps to think of CNC as the step that gives a part its final accuracy.</p>`,
      },
      {
        heading: 'Which machine type suits which part?',
        html: `<p>The geometry of the part decides the machine. Rotational parts such as shafts, bushings, pins and flanges belong on a lathe. Prismatic parts such as housings, brackets and plates belong on a milling machine. Many modern shops combine the two on multi-tasking machines that mill and turn in one setup.</p>
<ul>
<li>Three-axis milling machines cut features accessible from one direction and are the most economical choice for plates and simple housings.</li>
<li>Four-axis machines add a rotary table, so that features on several faces can be cut in one clamping.</li>
<li>Five-axis machines tilt and rotate the part or the head, allowing complex surfaces and undercuts and reducing the number of setups.</li>
<li>CNC lathes with live tooling turn the part and then mill flats, cross holes and keyways without removing it.</li>
<li>Swiss-type lathes support long, slender parts close to the cutting tool and suit small diameters in volume.</li>
</ul>
<p>Fewer setups generally mean better accuracy between features, because each re-clamping adds a small position error. When feature-to-feature relationships are critical, ask whether the part can be completed in a single setup.</p>
<p>Detailed process descriptions are available on the <a href="/industrial/metalworking-metal-manufacturing/cnc-precision-machining">CNC and precision machining</a> page.</p>`,
      },
      {
        heading: 'How tight can tolerances realistically be?',
        html: `<p>Tolerance is the permitted variation from the stated dimension, and it is the strongest cost driver on a machined part. General machining on a well-maintained CNC milling machine can hold relatively tight general tolerances without special measures. With attention to tooling, temperature and process control, still tighter features are attainable. Beyond that, grinding, honing or lapping is normally needed, and the cost rises quickly. Ask the shop what it will guarantee on your material and geometry rather than treating any single figure as universal.</p>
<p>Several factors work against tight tolerances: long unsupported features, thin walls that flex under cutting forces, large temperature changes between machining and measurement, and materials that release internal stress when cut. A good supplier will say so when a requested tolerance cannot be held reliably, and will suggest an alternative route.</p>
<p>Specify tight tolerances only where function demands them. A bearing seat and a mounting face may need accuracy of a few micrometres, while a clearance hole in a cover does not. Applying a general tolerance standard such as ISO 2768 to non-critical dimensions keeps the drawing readable and the price sensible.</p>`,
      },
      {
        heading: 'How do material choices affect machining?',
        html: `<p>Machinability varies widely. Free-cutting steels and aluminium alloys machine quickly and give good surface finish. Stainless steels work-harden and wear tools, so speeds are lower and cutting is slower. Titanium and nickel alloys retain strength at temperature and need rigid setups, sharp tools and careful coolant control. Brass and many plastics machine easily but can burr or deform.</p>
<p>Material also affects stability. Bar and plate often contain residual stress from rolling or heat treatment, and when machining removes material unevenly the part can bow. This is why precision parts are frequently rough-machined, rested or stress-relieved, and then finish-machined. Heat treatment adds another variable: parts machined before hardening may distort in the furnace, while hard machining after hardening needs suitable tools or grinding.</p>
<p>If the drawing calls for a specific grade, supply the standard designation and any required certification. Substituting a similar grade without agreement can change machinability, strength and corrosion behaviour.</p>`,
      },
      {
        heading: 'What do workholding and setup do to accuracy?',
        html: `<p>The cutting tool does not machine accurately unless the part is held accurately. Workholding includes vices, chucks, collets, fixtures and vacuum tables, and each has limits. Clamping force can deform thin parts, so a part that measures correctly while clamped may spring out of tolerance when released.</p>
<p>For repeat orders, dedicated fixtures and probing routines are worth the investment. A fixture locates the part the same way every time, and an on-machine probe can measure datum surfaces and correct the program before the cut. This reduces dependence on operator skill and shortens setup time on later batches.</p>
<ul>
<li>Datums on the drawing should match the surfaces the machinist will use for location.</li>
<li>Avoid features that force awkward clamping, such as thin flanges on both sides.</li>
<li>Allow stock for finishing cuts on critical surfaces.</li>
<li>Plan secondary operations, such as deburring and cleaning, in the route.</li>
</ul>`,
      },
      {
        heading: 'How is a machined part inspected?',
        html: `<p>Inspection confirms that the process delivered what the drawing asked. Simple dimensions are checked with calipers, micrometres, bore gauges and thread gauges. Complex geometry, form and position tolerances call for a coordinate measuring machine (CMM), which probes the part and compares the result to the model and to the drawing.</p>
<p>The inspection plan depends on the part and the risk. For first articles, a full dimensional report covering every drawing feature is typical. For later production, a sampling plan checks critical dimensions at set intervals, and in-process measurement on the machine catches drift before it creates scrap. Surface roughness is measured with a profilometer, and values such as Ra 3.2 micrometres on general surfaces and Ra 0.8 on sealing or sliding faces are common.</p>
<p>The measurement environment matters too. Metal expands with temperature, so precise measurement happens in a controlled space and after the part has reached ambient temperature. Buyers who need documented results should state it in the order and ask which report format the supplier provides.</p>`,
      },
      {
        heading: 'What drives machining cost?',
        html: `<p>Cost comes from machine time, setup, material, tooling, inspection and secondary processes. Machine time depends on the volume of material removed, the cutting speed allowed by the alloy and the number of features. Setup cost is spread over the batch, so small runs carry a high cost per part.</p>
<p>Design choices strongly affect the result. Deep narrow pockets need long tools and slow cutting. Internal corners with small radii require small cutters. Features on many faces need many setups. Tight tolerances demand slower finishing passes and more inspection. Simplifying geometry, using standard hole sizes and giving internal corners generous radii can cut cost without hurting function.</p>
<p>Quantity matters in both directions. A fixture and a dedicated program justify themselves at moderate volumes, while a prototype is cheaper to produce with general tooling. Ask suppliers to quote at several quantities so you can see where the price per part starts to fall.</p>`,
      },
      {
        heading: 'What should a drawing contain?',
        html: `<p>A clear drawing is the cheapest quality tool a buyer owns. It should carry the part number and revision, material and condition, general tolerance standard, critical dimensions with tolerances, geometric tolerances where function needs them, surface finish requirements, thread specifications, and any treatment such as anodising or hardening.</p>
<p>Provide a 3D model alongside the 2D drawing. The model speeds up programming, while the drawing remains the authority on tolerance and requirements. If the two disagree, the supplier should ask, and the answer should be written down.</p>
<ul>
<li>Show datums that reflect how the part works in the assembly.</li>
<li>Mark the critical features and let the rest fall under general tolerances.</li>
<li>State inspection and documentation expectations.</li>
<li>Give quantities, expected repeat orders and delivery dates.</li>
</ul>
<p>With this information a supplier can quote accurately, plan the route and tell you honestly whether the part is practical to make.</p>`,
      },
    ],
    faq: [
      {
        question: 'What tolerance can CNC machining hold?',
        answer:
          'Standard CNC milling can hold relatively tight general tolerances, and still tighter features are possible with controlled conditions. Exact figures depend on the feature, material and process plan. Tighter tolerances usually need grinding or other finishing methods and cost more.',
      },
      {
        question: 'Is five-axis machining always better than three-axis?',
        answer:
          'No. Five-axis machines suit complex surfaces and parts that need several faces cut in one setup. For plates and simple housings, three-axis machining is usually more economical and gives the same quality.',
      },
      {
        question: 'Why do thin machined parts sometimes go out of tolerance?',
        answer:
          'Thin walls flex under cutting force and clamping, and material can release internal stress as it is removed. Suppliers manage this with staged roughing and finishing, careful workholding and sometimes stress relief between operations.',
      },
      {
        question: 'Do I need a CMM report for every part?',
        answer:
          'Not necessarily. Many orders rely on sampling plans or first-article reports, and a full CMM report on every part adds cost. State the documentation you need in the order, and the supplier can plan the inspection to match.',
      },
      {
        question: 'How can I reduce the cost of a machined part?',
        answer:
          'Apply tight tolerances only where function requires them, use standard hole sizes and generous internal radii, reduce the number of setups, and quote at several quantities. A short design review with the supplier often finds savings.',
      },
    ],
    discussion: [
      {
        buyerAuthor: 'Industrial buyer',
        buyerRole: 'Procurement specialist',
        buyerDate: '2026-07-30',
        buyerBody: [
          'Our drawings carry a very tight general tolerance on most dimensions because the designer copied the same note everywhere. Suppliers quote very high. What should we do?',
        ],
        expertDate: '2026-07-31',
        expertBody: [
          'Ask the designer to review which features really need that tolerance. Typically only mating surfaces, bearing fits and sealing faces do, and the rest can sit under a general standard.',
          'Then send the revised drawing for re-quotation. Many buyers see a large drop in price, because tight tolerance everywhere forces slow finishing cuts and extra inspection on every feature.',
        ],
      },
      {
        buyerAuthor: 'Manufacturing buyer',
        buyerRole: 'Quality and sourcing engineer',
        buyerDate: '2026-08-06',
        buyerBody: [
          'A batch of parts passed at the supplier but failed at our incoming inspection on the same dimension. How do we find the cause?',
        ],
        expertDate: '2026-08-07',
        expertBody: [
          'Compare the measurement methods first: the same gauge, the same datum, the same temperature and the same part condition. A difference in datum or in clamping during measurement explains many disputes.',
          'Then share raw data both ways and agree a reference method on the drawing or in the quality agreement. If the supplier uses a CMM and you use hand gauges, state which result is authoritative.',
        ],
      },
      {
        buyerAuthor: 'Industrial buyer',
        buyerRole: 'Design engineer',
        buyerDate: '2026-08-12',
        buyerBody: [
          'Should we specify hardening before or after machining for a steel shaft with tight fits?',
        ],
        expertDate: '2026-08-13',
        expertBody: [
          'It depends on the required hardness, the geometry and the tolerance. Machining before hardening is cheaper, but the part can distort in the furnace, so critical surfaces often get a grinding allowance and are finished after heat treatment.',
          'Discuss the route with the supplier at the design stage, and state the hardness range and the surfaces that must be finished after treatment on the drawing.',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 4. Welding quality and inspection
  // ---------------------------------------------------------------------------
  {
    slug: 'welding-metal-fabrication-quality-standards-inspection',
    title: 'Welding and Metal Fabrication Quality: Standards, Inspection and Production Control',
    h1: 'Welding and Metal Fabrication Quality: Standards, Inspection and Production Control',
    previewTitle: 'Welding and Fabrication Quality: Standards and Inspection',
    previewText:
      'How welded and fabricated products are controlled in production, which inspection methods exist, and how buyers can set requirements that fit the product and market.',
    metaTitle: 'Welding and Metal Fabrication Quality: Inspection Guide',
    metaDescription:
      'A buyer guide to welding quality: procedures, welder qualification, inspection methods, records and how requirements depend on product, industry and project.',
    publishedAt: '2026-09-11',
    image: 'blog-welding-quality-inspection.jpg',
    alt: 'Inspector checking a welded joint on a fabricated steel assembly',
    blogCategorySlugs: ['metalworking-metal-manufacturing', 'welding'],
    siteCategorySlugs: ['industrial-welding', 'quality-inspection'],
    sections: [
      {
        heading: 'Requirements depend on the product, industry and project',
        html: `<p>There is no single quality requirement that applies to every welded product. A garden gate, a conveyor frame, a pressure vessel, a crane runway beam and a medical device housing each carry different risks, and each is governed by different rules, if any. The correct requirement comes from the product, the industry, the market where it will be used and the contract for the particular project.</p>
<p>Some projects call up published standards. Examples that appear in specifications include ISO 3834 for quality requirements in fusion welding, ISO 5817 for weld imperfection levels, EN 1090 for execution of structural steel and aluminium, ASME Section IX for welding qualifications, and AWS D1.1 for structural welding of steel. Which of these applies, if any, is a decision made by the designer, the customer or a regulator, not by the supplier. A buyer should state the required standard, the acceptance level and the inspection scope in the enquiry, and should treat a supplier claiming every certification as a reason to ask more questions.</p>
<p>This article follows the production flow and shows where quality is built in. It sits within the wider area of <a href="/industrial/metalworking-metal-manufacturing">Metalworking &amp; Metal Manufacturing</a>, where welding is one of several connected processes.</p>`,
      },
      {
        heading: 'Control point 1: Welding procedures and personnel',
        html: `<p>The first control is the definition of how the weld will be made. A welding procedure specification (WPS) records the process, material, thickness range, joint type, consumables, shielding gas, preheat, interpass temperature and parameter ranges. Where the project requires it, the procedure is qualified by making a test weld and testing it, and the results are recorded in a procedure qualification record.</p>
<p>The second part is the people. Welders can be tested and qualified for a process, a material group, a thickness range and a position. Qualification typically has a validity period and needs periodic confirmation. Where the contract requires it, the supplier should show a current certificate for each welder who works on the job.</p>
<p>Welding coordination is the third element. On larger or regulated work, a named person with suitable knowledge supervises welding procedures, welder assignment, inspection and corrective action. Ask who holds this role and what authority they have to stop work.</p>
<p>For a view of how these controls appear in heavy production, see the <a href="/industrial/metalworking-metal-manufacturing/welding-heavy-fabrication">welding and heavy fabrication</a> page.</p>`,
      },
      {
        heading: 'Control point 2: Material and consumable control',
        html: `<p>A good weld on the wrong material is still a defect. Incoming material is checked against the order, and where traceability is required, heat or batch numbers are transferred to each cut piece. Stainless steel and aluminium are stored separately from carbon steel to avoid cross-contamination, and tools such as brushes and discs are kept for one material only.</p>
<p>Consumables are controlled just as carefully. Low-hydrogen electrodes and flux must be stored dry and often rebaked before use, because moisture introduces hydrogen that can cause cracking in high-strength or thick steel. Wire and gas should match the procedure, and batches should be identifiable. Mix-ups between similar-looking consumables are a classic source of failures that are hard to trace after the fact.</p>
<ul>
<li>Check certificates against the specification on receipt.</li>
<li>Keep identification through cutting and fit-up if traceability is required.</li>
<li>Store and issue consumables according to the manufacturer instructions.</li>
<li>Calibrate or verify gas flow and welding equipment on a defined schedule.</li>
</ul>`,
      },
      {
        heading: 'Control point 3: Fit-up and in-process checks',
        html: `<p>Most weld defects are created before the arc is struck. A joint with a wrong gap, a poor bevel, rust, oil or moisture is a joint likely to fail inspection. Fit-up inspection checks joint geometry, cleanliness, alignment and tack welds against the procedure and the drawing before welding begins.</p>
<p>During welding, in-process checks monitor preheat and interpass temperature, parameters and sequence. Visual checks between passes catch slag inclusions and lack of fusion early, when a grinder fixes the problem in minutes. Once a joint is filled and covered, the same defect needs excavation and rewelding.</p>
<p>Distortion control is part of quality, too. A frame that is straight on paper but twisted after welding creates assembly problems for the customer. Fixtures, weld sequences and dimensional checks after welding keep geometry within the drawing tolerance, and a record of results helps spot drift across a batch.</p>`,
      },
      {
        heading: 'Control point 4: Visual inspection and non-destructive testing',
        html: `<p>Visual inspection is the basic method and covers every weld. A trained inspector examines weld size, profile, undercut, spatter, cracks and surface porosity, often with gauges. Many specifications require visual inspection of all welds before any other method is applied.</p>
<p>Non-destructive testing (NDT) looks for flaws that the eye cannot see. Common methods are:</p>
<ul>
<li>Magnetic particle testing, which reveals surface and near-surface cracks in ferromagnetic materials.</li>
<li>Penetrant testing, which shows surface-breaking flaws in any non-porous material, including stainless steel and aluminium.</li>
<li>Ultrasonic testing, which detects internal flaws such as lack of fusion and cracks, and suits thick sections.</li>
<li>Radiographic testing, which produces an image of the internal weld structure and is used where a permanent record is needed.</li>
</ul>
<p>How much NDT is used, and on which welds, is set by the specification, the weld category and the consequence of failure. Testing every weld by every method is neither necessary nor economical. The buyer should state the extent, the method, the acceptance level and who is qualified to perform it.</p>`,
      },
      {
        heading: 'Control point 5: Procedure qualification and destructive testing',
        html: `<p>Destructive tests prove that a welding procedure produces a joint with the required properties. A test piece is welded under production conditions and then cut and tested. Typical tests include tensile tests to confirm strength, bend tests to show ductility and soundness, macro-sections to examine fusion and penetration, hardness traverses to check the heat-affected zone, and impact tests where low-temperature toughness matters.</p>
<p>These tests belong to procedure qualification and are not repeated on production parts, apart from production test plates on some regulated work. A supplier with an existing qualified procedure for your material, thickness and joint type saves time and cost. If none exists, qualifying a new procedure adds lead time that should be in the project plan.</p>
<p>Some products need only a simple proof test or a load test, and not a full qualification regime. Pressure equipment, lifting equipment and safety-critical structures usually sit at the stricter end, but the exact requirement comes from the applicable rules for that product and place of use.</p>`,
      },
      {
        heading: 'Control point 6: Records, traceability and nonconformance',
        html: `<p>Records turn good practice into evidence. Depending on the contract, they may include the procedure used for each weld, welder identity, material certificates, consumable batches, inspection and NDT reports, dimensional results and coating records. These documents are most valuable when they are linked to the individual part or assembly by a serial number or a traveller sheet that moves with the work.</p>
<p>Nonconformance handling shows how mature a supplier is. A defect is identified, recorded, assessed against the acceptance criteria and then repaired, accepted by concession or scrapped. Repairs follow an approved procedure, and the repaired weld is reinspected. The buyer should know whether concessions need customer approval, and the contract should say so.</p>
<p>Trends tell more than single events. A supplier that analyses repeated defect types, such as porosity from shielding gas problems or undercut from technique, and corrects the cause, is more reliable than one that fixes each defect quietly and moves on.</p>`,
      },
      {
        heading: 'What a buyer can specify and ask',
        html: `<p>A buyer can reduce risk and cost by writing requirements that match the product. Start with the consequence of failure: a decorative handrail and a load-bearing frame deserve different levels of control. Then state what is needed in the enquiry, instead of leaving the supplier to guess.</p>
<ul>
<li>The applicable standard or specification, if there is one, and the acceptance level for weld quality.</li>
<li>Whether welding procedures and welder qualifications must be shown, and to which rules.</li>
<li>The extent of visual inspection and NDT, and who is qualified to perform and report it.</li>
<li>Traceability needs for material and consumables.</li>
<li>Documentation required at delivery, and how long records must be kept.</li>
<li>Customer witness or hold points, and the notice needed for them.</li>
</ul>
<p>During supplier assessment, ask to see a typical inspection report, a welding procedure and a nonconformance record, with confidential details removed. Ask how corrective actions are closed. These documents tell you more about daily practice than a certificate on the wall, and they let you judge whether the supplier fits your product, your industry and your market.</p>`,
      },
    ],
    faq: [
      {
        question: 'Does every welded product need certified welders and a qualified procedure?',
        answer:
          'No. Requirements depend on the product, the industry, the market and the project contract. Some work, such as pressure equipment or structural steel under a specified standard, requires qualified procedures and welders, while other products do not.',
      },
      {
        question: 'What is the difference between visual inspection and NDT?',
        answer:
          'Visual inspection examines the surface of every weld with the eye and simple gauges. NDT methods, such as magnetic particle, penetrant, ultrasonic and radiographic testing, find surface or internal flaws that cannot be seen and are applied according to the specification.',
      },
      {
        question: 'What does a welding procedure specification contain?',
        answer:
          'A WPS records the welding process, material and thickness range, joint type, consumables, shielding gas, preheat and interpass temperature, and parameter ranges. It tells the welder how to make the weld and gives the inspector a reference.',
      },
      {
        question: 'Which weld standard should I name in my enquiry?',
        answer:
          'Name the standard your designer, customer or regulator requires for your product and market. If none applies, describe the function, the loading and the acceptance level you need, and ask the supplier to propose a suitable approach.',
      },
      {
        question: 'How do I judge a supplier quality system quickly?',
        answer:
          'Ask for sample records with sensitive details removed: a welding procedure, an inspection report and a closed nonconformance report. Look at how defects are traced, assessed and corrected, and compare the answers with your requirements.',
      },
    ],
    discussion: [
      {
        buyerAuthor: 'Manufacturing buyer',
        buyerRole: 'Supplier quality engineer',
        buyerDate: '2026-09-17',
        buyerBody: [
          'A supplier said it follows every major welding standard. How should we respond when our product only needs one?',
        ],
        expertDate: '2026-09-18',
        expertBody: [
          'Ask which standard they apply to which products, and request evidence for the one you need. A claim covering everything is hard to check, while a specific statement with matching records is easy to verify.',
          'Then state your own requirement in the order, including acceptance level and inspection scope, so that the supplier works to your product rather than a general promise.',
        ],
      },
      {
        buyerAuthor: 'Industrial buyer',
        buyerRole: 'Purchasing manager',
        buyerDate: '2026-09-24',
        buyerBody: [
          'How much NDT is reasonable on a welded frame that carries moderate loads? We want to avoid paying for unnecessary testing.',
        ],
        expertDate: '2026-09-25',
        expertBody: [
          'Start from the consequence of failure and the applicable rules. For many moderate-load frames, full visual inspection with surface testing on a sample of critical welds is a sensible level, but the designer should confirm this.',
          'If a code applies, follow its required extent. If none applies, agree a risk-based plan with the designer and the supplier and write it into the order so that nobody has to guess later.',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 5. Choosing a metal manufacturing supplier
  // ---------------------------------------------------------------------------
  {
    slug: 'choose-metal-manufacturing-supplier-requirements-costs',
    title: 'How to Choose a Metal Manufacturing Supplier: Technical Requirements, Costs and Project Planning',
    h1: 'How to Choose a Metal Manufacturing Supplier: Technical Requirements, Costs and Project Planning',
    previewTitle: 'How to Choose a Metal Manufacturing Supplier',
    previewText:
      'A step-by-step method for matching a project to the right metal manufacturer, covering requirements, capability checks, cost drivers, lead time and planning.',
    metaTitle: 'How to Choose a Metal Manufacturing Supplier: Key Checks',
    metaDescription:
      'Choose a metal manufacturing supplier with confidence: define technical requirements, check process capability, understand cost drivers and plan the project.',
    publishedAt: '2026-10-29',
    image: 'blog-choose-metal-supplier.jpg',
    alt: 'Engineer and buyer reviewing a metal part drawing while assessing a manufacturing supplier',
    blogCategorySlugs: ['metalworking-metal-manufacturing', 'metal-fabrication'],
    siteCategorySlugs: ['supplier-discovery', 'technical-buyer-acquisition'],
    sections: [
      {
        heading: 'Start with the part and the project, not the supplier list',
        html: `<p>Buyers often begin by searching for suppliers and only then try to describe what they need. The better order is the reverse. A clear description of the part, the volume, the schedule and the performance requirements lets you test any supplier against the same criteria, and it makes the comparison between quotes meaningful.</p>
<p>The market for <a href="/industrial/metalworking-metal-manufacturing">metalworking and metal manufacturing</a> is wide. It covers fabricators, machine shops, welding contractors, foundries, heat treaters and finishers, and many suppliers combine several of these. A supplier that suits a prototype run of machined housings may not suit a series of welded frames, and a company strong in thin stainless sheet may lack the cranes and bays for heavy plate.</p>
<p>Before contacting anyone, write a one-page project brief. It should include the function of the part, the critical features, the material, the annual and batch volume, the delivery location, the target date and any known requirements for inspection, documentation and standards.</p>`,
      },
      {
        heading: 'Technical requirements to define before the request for quotation',
        html: `<p>A request for quotation (RFQ) is only as good as the information inside it. Vague requests produce vague quotes, and vague quotes produce disputes. Prepare the following before you ask for prices:</p>
<ul>
<li>Drawings with revision, dimensions, tolerances, material and surface treatment, plus 3D models in a neutral format.</li>
<li>Material specification and the certificates you expect at delivery.</li>
<li>Critical features, mating surfaces and datums, so that the supplier knows where accuracy matters.</li>
<li>Welding requirements, including weld sizes, procedures, personnel and inspection where applicable.</li>
<li>Surface and coating requirements, including thickness, colour and areas to mask.</li>
<li>Inspection and documentation: measurement methods, reports, first-article approval and record retention.</li>
<li>Commercial terms: quantities, call-off pattern, packaging, delivery terms and payment conditions.</li>
</ul>
<p>Mark which requirements are mandatory and which are preferences. If a requirement comes from a regulation, a customer specification or a market rule, say so, because the supplier then knows that it cannot be negotiated. Requirements differ between products and projects, and no checklist replaces a clear statement of what your particular part needs.</p>`,
      },
      {
        heading: 'Matching process capability to the part',
        html: `<p>The next step is to match the part to a route and the route to a supplier. A flat part with holes and bends points to laser cutting and press brake forming. A rotational or prismatic part with tight tolerances points to machining. A large frame points to heavy welding and, probably, machining after stress relief. Many parts need more than one.</p>
<p>The process guides on this site go into the detail of each route. The article on metal fabrication processes explains cutting, forming and joining, and the structures article follows a steel assembly from drawing to delivery. The CNC article shows how tolerance, material and setup decide accuracy, and the welding quality article describes how inspection and records fit the product. Use them as checklists when you review a supplier capability statement.</p>
<p>Look at the specific pages that describe the capabilities you need, such as <a href="/industrial/metalworking-metal-manufacturing/metal-fabrication">metal fabrication</a>, <a href="/industrial/metalworking-metal-manufacturing/cnc-precision-machining">CNC and precision machining</a> and <a href="/industrial/metalworking-metal-manufacturing/welding-heavy-fabrication">welding and heavy fabrication</a>. Then ask each candidate for evidence: machine list with bed size and capacity, material range, typical part examples and what they send out to partners.</p>`,
      },
      {
        heading: 'Evaluating quality and inspection capability',
        html: `<p>Capability is the ability to make the part. Quality is the ability to make it repeatedly and to prove it. Both matter, and you can check both before ordering.</p>
<p>Ask about measuring equipment: which gauges, whether a CMM is available and how it is calibrated. Ask how first articles are approved and how in-process checks are done. For welded work, ask for a sample welding procedure, welder qualification records where relevant, and the inspection methods the supplier performs in house or through a partner. For all work, ask how nonconformances are recorded and how corrective actions are closed.</p>
<p>Certifications are one input, and they have limits. A quality management certificate shows that a system exists and is audited, but it does not describe the capability for your part. Industry or product certifications matter only if your product, market or customer requires them. Do not demand credentials your project does not need, and do not accept a general claim in place of the one you do need.</p>
<p>A visit, in person or by video, often reveals more than documents. Observe housekeeping, material storage, how work is identified, how drawings are controlled at the bench and whether the people at the machines know the requirements of the job.</p>`,
      },
      {
        heading: 'Understanding what drives cost',
        html: `<p>Price comparison is easy to get wrong. Two quotes with a large gap may reflect different assumptions, not different efficiency. Compare what is included before you compare totals.</p>
<ul>
<li>Material: grade, certificates, waste allowance and market price movements.</li>
<li>Processing time: cutting, forming, welding and machining hours, which depend on geometry, tolerance and accessibility.</li>
<li>Setup and programming: fixed costs that weigh heavily on small batches.</li>
<li>Tooling and fixtures: one-off costs for dedicated tooling, sometimes quoted separately.</li>
<li>Finishing: coating, plating, heat treatment and any subcontract operations.</li>
<li>Inspection and documentation: higher levels of testing and reporting add real cost.</li>
<li>Packaging and transport: significant on large or fragile parts.</li>
</ul>
<p>Ask for a breakdown, or at least a clear statement of what the price covers and what it excludes. Ask for pricing at several quantities, and ask what changes would reduce the price, such as relaxed tolerances, a different material or simpler geometry. A supplier that offers sensible design suggestions is showing engineering ability, not only selling hours.</p>
<p>Be careful with the lowest quote. If it is based on misread requirements, the savings disappear in rework, delays and disputes.</p>`,
      },
      {
        heading: 'Lead time, capacity and communication',
        html: `<p>A supplier can be technically capable and still be the wrong choice if its capacity does not match your schedule. Ask about current workload, the lead time for material, the lead time for external processes such as galvanising or heat treatment, and how they plan capacity for repeat orders.</p>
<p>Communication is a practical capability. Who is your contact, how quickly do they answer technical questions, and who can make decisions? A clear route for questions, drawing changes and concession requests prevents small misunderstandings from becoming scrap. Agree on the language of documents, the time zone for calls and the channel for formal approvals.</p>
<p>Capacity risk is easy to overlook. A supplier with one critical machine or one qualified welder has a single point of failure. Ask how work is covered when equipment is down or staff are absent, and whether a backup process exists. For long-term supply, ask about stock policies, safety stock and how forecasts are shared.</p>`,
      },
      {
        heading: 'Planning the project from request to first article',
        html: `<p>Good planning turns a selection into a successful delivery. A typical sequence for a new part runs as follows.</p>
<ul>
<li>Brief and RFQ: send a complete package and a clear deadline for questions.</li>
<li>Technical clarification: answer queries in writing, and update the drawing if needed.</li>
<li>Quotation review: compare scope, assumptions and exclusions, not only price.</li>
<li>Pre-production meeting: confirm the route, inspection points, packaging and schedule.</li>
<li>First article: produce one or a few parts, inspect fully and approve before the batch.</li>
<li>Batch production: monitor with agreed checks and report deviations quickly.</li>
<li>Delivery and review: record performance, update requirements and plan the next order.</li>
</ul>
<p>Build contingency into the schedule for material delays, first-article corrections and external processes. For new suppliers, consider a small trial order before committing a long contract. It costs a little more per part and shows how the supplier behaves when things do not go to plan.</p>
<p>Write what you have agreed. A short order confirmation that lists drawing revision, quantities, delivery date, inspection requirements and documents avoids most later arguments.</p>`,
      },
      {
        heading: 'Warning signs in supplier responses',
        html: `<p>Some patterns in a supplier response suggest that more questions are needed. A quote that arrives very quickly with no questions about a complex part may mean the drawing was not studied. A supplier that agrees to every tolerance without comment may be unaware of the difficulty, or may plan to inspect lightly. Vague descriptions of capacity, a refusal to share sample reports and a reluctance to discuss subcontracting are all reasons to probe further.</p>
<p>Look also at what a supplier does not say. If your part needs galvanising and the response never mentions who will do it, ask. If it needs welding to a standard and the quote lists generic inspection, ask. Honest suppliers will list their assumptions and tell you what they cannot do.</p>
<p>The strongest signal is technical engagement. A supplier that asks about function, proposes manufacturing improvements, highlights risks and offers alternatives is thinking about your part. That behaviour tends to continue through production, which is why technical engagement should weigh as much as price in the final decision.</p>`,
      },
    ],
    faq: [
      {
        question: 'What should I include in a request for quotation for metal parts?',
        answer:
          'Include drawings with revision, tolerances, material and finish, a 3D model, quantities and call-off pattern, delivery location and date, and inspection and documentation needs. Mark mandatory requirements and say where they come from, such as a standard or customer specification.',
      },
      {
        question: 'Is the cheapest quote usually the best choice?',
        answer:
          'Rarely. A low price may rest on a misread drawing, lighter inspection or missing operations. Compare scope, assumptions and exclusions first, and weigh technical engagement and delivery reliability alongside price.',
      },
      {
        question: 'Do I need a supplier with specific certifications?',
        answer:
          'Only if your product, market, industry or customer requires them. State the requirement in the enquiry and ask for evidence that applies to your part, instead of relying on a general claim about certifications.',
      },
      {
        question: 'How can I check supplier capability before placing an order?',
        answer:
          'Ask for a machine and equipment list, examples of similar parts, sample inspection and welding records, and details of any subcontracted steps. A site visit, in person or by video, shows how work is organised and controlled.',
      },
      {
        question: 'Why order a first article before the full batch?',
        answer:
          'A first article proves that the route, programs, fixtures and inspection deliver the drawing. Finding an error on one part costs far less than finding it across a batch, and approval gives both sides a shared reference.',
      },
      {
        question: 'How do I reduce risk when working with a new supplier?',
        answer:
          'Start with a small trial order, agree inspection and documentation in writing, hold a pre-production meeting and plan time for corrections. Review performance after the first delivery before committing to larger volumes.',
      },
    ],
    discussion: [
      {
        buyerAuthor: 'Industrial buyer',
        buyerRole: 'Procurement manager',
        buyerDate: '2026-11-03',
        buyerBody: [
          'We received three quotes for the same welded frame, and the highest is nearly double the lowest. How do we compare them fairly?',
        ],
        expertDate: '2026-11-04',
        expertBody: [
          'Line up the scope first: material grade and certificates, weld inspection, machining after welding, coating, packaging and delivery. A large gap often comes from a different reading of one of those items.',
          'Then ask each supplier to confirm its assumptions in writing. Once the scope matches, the remaining difference reflects efficiency, capacity and risk allowance, and you can judge it properly.',
        ],
      },
      {
        buyerAuthor: 'Manufacturing buyer',
        buyerRole: 'Sourcing lead',
        buyerDate: '2026-11-07',
        buyerBody: [
          'Is it worth paying for a first article on a simple bracket, or does that only matter for complex parts?',
        ],
        expertDate: '2026-11-08',
        expertBody: [
          'For a simple bracket in a large batch, a first article is still cheap insurance. Bend angles, hole positions and finish are easy to get wrong in setup, and one checked part protects the whole run.',
          'You can keep it light for simple parts: a short dimensional check on the critical features and a photo record are often enough. Reserve full reports for parts where function or compliance demands them.',
        ],
      },
    ],
  },
]
