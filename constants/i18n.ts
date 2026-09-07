export type Language = "en" | "es" | "ht";

// Keyed by the exact English source string used in the UI. t(s) looks up the
// current language's translation, falling back to the English input itself
// when a key is missing (so a missed string just shows in English instead of
// crashing or showing blank).
const ES: Record<string, string> = {
  // Nav / drawer
  "Publisher's Desk": "Escritorio del Editor",
  Today: "Hoy",
  Read: "Leer",
  Search: "Buscar",
  Plans: "Planes",
  Library: "Biblioteca",
  Precepts: "Preceptos",
  "How to Use": "Cómo Usar",
  Settings: "Configuración",
  Menu: "Menú",
  "Reading Plans": "Planes de Lectura",
  "Upgrade to Premium": "Mejorar a Premium",
  "Unlock commentary, study tools, and more.": "Desbloquea comentarios, herramientas de estudio y más.",
  "Upgrade Now": "Mejorar Ahora",
  "✧ DAILY VERSE ✧": "✧ VERSÍCULO DIARIO ✧",
  "Thy word is a lamp unto my feet, and a light unto my path.":
    "Lámpara es a mis pies tu palabra, y lumbrera á mi camino.",
  "KJV 1611 with Apocrypha": "Reina-Valera 1909 con Apócrifos",
  "Coming soon": "Próximamente",
  "Coming Soon": "Próximamente",

  // Header / reader
  "Continue Reading": "Continuar Leyendo",
  "Full text coming soon": "Texto completo próximamente",
  "Chapter text coming soon": "Texto del capítulo próximamente",

  // Desk screen
  "Good morning": "Buenos días",
  "Good afternoon": "Buenas tardes",
  "Good evening": "Buenas noches",
  "CONTINUE READING": "CONTINUAR LEYENDO",
  Bookmarks: "Marcadores",
  Notes: "Notas",
  "Today's Scripture": "Escritura de Hoy",
  "Read Full Chapter": "Leer Capítulo Completo",
  Bookmark: "Guardar",
  Share: "Compartir",
  "Featured Collection": "Colección Destacada",
  "Mighty Men of Valor": "Hombres Valientes",
  "Twelve portraits of courage and faith, from Gideon's three hundred to David's mighty men.":
    "Doce retratos de valentía y fe, desde los trescientos de Gedeón hasta los valientes de David.",
  "6 Books Available": "6 Libros Disponibles",
  "Open Collection": "Abrir Colección",
  "Discover Something New": "Descubre Algo Nuevo",
  "Sin-Specific Guide": "Guía Contra Pecados Específicos",
  "Thirty-six sins named in Mark 7 and Romans 1, each paired with scripture precepts to overcome it.":
    "Treinta y seis pecados nombrados en Marcos 7 y Romanos 1, cada uno con preceptos bíblicos para vencerlo.",
  "Learn More ›": "Más Información ›",
  ADVERTISEMENT: "PUBLICIDAD",
  "Face Jerusalem — Always know the direction of your homeland": "Face Jerusalem — Conoce siempre la dirección de tu patria",
  "Get App ›": "Obtener App ›",
  "Enter Library": "Entrar a la Biblioteca",

  // Today screen
  "VERSE OF THE DAY": "VERSÍCULO DEL DÍA",
  "Read in context →": "Leer en contexto →",

  // Search
  "Search the KJV, notes…": "Buscar en la Biblia, notas…",
  "Full Bible": "Biblia Completa",
  Apocrypha: "Apócrifos",
  "Current Book": "Libro Actual",
  "All Books": "Todos los Libros",
  "Enter a text to search": "Escribe algo para buscar",
  "No results for": "Sin resultados para",

  // Read screen empty state
  "isn't loaded in this build yet.": "aún no está disponible en esta versión.",
  "Try Genesis 1–2, Psalm 23, or John 3.": "Prueba Génesis 1–2, Salmo 23, o Juan 3.",
  "This chapter's translation isn't ready yet — showing the English text.":
    "La traducción al español de este capítulo aún no está lista — mostrando el texto en inglés.",

  // Plans
  "1-YEAR PLAN": "PLAN DE 1 AÑO",
  "Chronological Reading": "Lectura Cronológica",
  "days": "días",
  "TOPICAL STUDY": "ESTUDIO TEMÁTICO",
  "Sin-Specific Battles": "Batallas Contra Pecados Específicos",
  "Sin Battles: Mark 7": "Batallas Contra Pecados: Marcos 7",
  "Sin Battles: Romans 1": "Batallas Contra Pecados: Romanos 1",
  "sins from Mark 7:21-23": "pecados de Marcos 7:21-23",
  "sins from Mark 7 & Romans 1": "pecados de Marcos 7 y Romanos 1",
  "sins": "pecados",
  "12 CATEGORIES": "12 CATEGORÍAS",
  "Study by Category": "Estudio por Categoría",
  "topics": "temas",
  "WEEK PLAN": "PLAN DE SEMANAS",
  "Weekly Study Plan": "Plan de Estudio Semanal",

  // Library
  "No bookmarks yet. Tap a verse in Read to save one.": "Aún no hay marcadores. Toca un versículo en Leer para guardar uno.",
  "No highlights yet.": "Aún no hay resaltados.",
  "No notes yet.": "Aún no hay notas.",
  "+ New Note": "+ Nueva Nota",
  "Tap a verse, then Note to add one": "Toca un versículo y luego Nota para añadir una",
  Highlights: "Resaltados",

  // Book picker
  Books: "Libros",
  "Old Testament": "Antiguo Testamento",
  "New Testament": "Nuevo Testamento",

  // Note composer
  "Note on": "Nota sobre",
  "Write your thoughts…": "Escribe tus pensamientos…",
  "Save Note": "Guardar Nota",
  "Note saved": "Nota guardada",

  // Verse action bar
  "Close ✕": "Cerrar ✕",
  Copy: "Copiar",
  Save: "Guardar",
  Note: "Nota",
  "Copied to clipboard": "Copiado al portapapeles",
  "KJV Narration": "Narración Bíblica",
  "Highlight saved": "Resaltado guardado",
  "Highlight cleared": "Resaltado eliminado",
  "Bookmark removed": "Marcador eliminado",
  "Bookmark saved": "Marcador guardado",

  // Settings
  Notification: "Notificaciones",
  Notifications: "Notificaciones",
  "Reading Atmosphere": "Ambiente de Lectura",
  ACTIVE: "ACTIVO",
  "Royal Parchment": "Pergamino Real",
  "Temple Stone": "Piedra del Templo",
  "Midnight Scroll": "Pergamino de Medianoche",
  "Luxury • Warm • Premium • Timeless": "Lujo • Cálido • Premium • Atemporal",
  "Modern • Clean • Biblical • Sophisticated": "Moderno • Limpio • Bíblico • Sofisticado",
  "Cinematic • Focused • Premium • Easy on Eyes": "Cinemático • Enfocado • Premium • Suave para los Ojos",
  "Warm daylight reading inspired by handcrafted heirloom Bibles.":
    "Lectura cálida de día inspirada en Biblias heredadas hechas a mano.",
  "Balanced study environment inspired by Jerusalem's timeless architecture.":
    "Ambiente de estudio equilibrado inspirado en la arquitectura atemporal de Jerusalén.",
  "An immersive candlelit experience designed for evening Scripture reading.":
    "Una experiencia inmersiva a la luz de velas diseñada para la lectura nocturna de la Escritura.",
  Font: "Fuente",
  Language: "Idioma",
  English: "Inglés",
  Español: "Español",
  "Reader Font Size": "Tamaño de Fuente",
  "Audio Narration": "Narración de Audio",
  "Uploaded:": "Subido:",
  "No custom narration uploaded": "No hay narración personalizada",
  "Upload Recording": "Subir Grabación",
  Remove: "Eliminar",
  "Narration uploaded": "Narración subida",
  "Narration removed": "Narración eliminada",
  "Upload failed — try again": "Error al subir — intenta de nuevo",
  "About App": "Acerca de la App",
  Feedback: "Comentarios",
  "About Us": "Acerca de Nosotros",
  "Rate Us": "Califícanos",
  Support: "Soporte",
  "Explore the Collection": "Explorar la Colección",
  Help: "Ayuda",

  // About This Translation
  "About This Translation": "Acerca de Esta Traducción",
  "The King James Version (1611)": "La Versión Rey Jacobo (1611)",
  "Sacred Scroll's Bible text is the King James Version, first published in 1611 under King James I of England. Commissioned from the Hebrew and Greek source texts by a team of nearly fifty scholars, it remains one of the most widely read and quoted English Bible translations in history.":
    "El texto bíblico de Sacred Scroll es la Versión Rey Jacobo, publicada por primera vez en 1611 bajo el rey Jacobo I de Inglaterra. Encargada a partir de los textos originales en hebreo y griego por un equipo de casi cincuenta eruditos, sigue siendo una de las traducciones bíblicas en inglés más leídas y citadas de la historia.",
  "Its language has shaped English literature and worship for over four centuries, and it is the translation this app is built around, cover to cover.":
    "Su lenguaje ha marcado la literatura y la adoración en inglés por más de cuatro siglos, y es la traducción sobre la cual está construida esta aplicación, de principio a fin.",
  "The Apocrypha": "Los Apócrifos",
  "Alongside the 66 books of the standard Protestant canon, Sacred Scroll includes the Apocrypha — a collection of historical, wisdom, and devotional books that appeared in the original 1611 King James Bible.":
    "Además de los 66 libros del canon protestante estándar, Sacred Scroll incluye los Apócrifos — una colección de libros históricos, de sabiduría y devocionales que aparecían en la Biblia Rey Jacobo original de 1611.",
  "These books were part of English Bibles for centuries before later editions removed them. We include them here as they were originally printed, for readers who want the complete 1611 text.":
    "Estos libros formaron parte de las Biblias en inglés durante siglos antes de que ediciones posteriores los eliminaran. Los incluimos aquí tal como se imprimieron originalmente, para los lectores que desean el texto completo de 1611.",

  // Chrono detail
  "The whole Bible in one year, ordered by when events happened":
    "Toda la Biblia en un año, ordenada según cuándo ocurrieron los eventos",
  "of": "de",
  "days complete.": "días completados.",
  Weekly: "Semanal",
  Monthly: "Mensual",
  Quarterly: "Trimestral",
  Yearly: "Anual",
  "YEAR PROGRESS": "PROGRESO DEL AÑO",
  "days read": "días leídos",
  Quarter: "Trimestre",
  Days: "Días",
  Week: "Semana",
  Day: "Día",

  // Sin battles
  "MARK 7:21-23": "MARCOS 7:21-23",
  "Mark 7:21-23 — for out of the heart proceed evil thoughts, adulteries, fornications, murders, thefts, covetousness, wickedness, deceit, lasciviousness, an evil eye, blasphemy, pride, foolishness. For each, at least three precepts to overcome.":
    "Marcos 7:21-23 — porque de dentro, del corazón de los hombres, salen los malos pensamientos, los adulterios, las fornicaciones, los homicidios, los hurtos, las avaricias, las maldades, el engaño, la lascivia, el ojo maligno, la blasfemia, la soberbia, la insensatez. Para cada uno, al menos tres preceptos para vencerlo.",
  "ROMANS 1:29-31": "ROMANOS 1:29-31",
  "Romans 1:29-31 — being filled with all unrighteousness, fornication, wickedness, covetousness, maliciousness; full of envy, murder, debate, deceit, malignity; whisperers, backbiters, haters of God, despiteful, proud, boasters, inventors of evil things, disobedient to parents, without understanding, covenantbreakers, without natural affection, implacable, unmerciful. For each, at least three precepts to overcome.":
    "Romanos 1:29-31 — estando atestados de toda injusticia, fornicación, malicia, avaricia, maldad; llenos de envidia, homicidios, contiendas, engaños, malignidades; murmuradores, detractores, aborrecedores de Dios, injuriosos, soberbios, vanagloriosos, inventores de males, desobedientes á los padres, necios, desleales, sin afecto natural, implacables, sin misericordia. Para cada uno, al menos tres preceptos para vencerlo.",

  // Precepts
  "Topical scripture chains. Each topic's key verse is highlighted in the Read tab with a ¹ footnote linking the rest of the chain.":
    "Cadenas de escritura por tema. El versículo clave de cada tema se resalta en la pestaña Leer con una nota ¹ que enlaza el resto de la cadena.",
  "View in Reader": "Ver en el Lector",
  "A–Z TOPICS": "TEMAS A–Z",
  "FEATURED TOPICS": "TEMAS DESTACADOS",
  "Hand-picked topics to start with, grouped by theme.": "Temas seleccionados para comenzar, agrupados por tema.",
  "Relationships & Family": "Relaciones y Familia",
  "Spiritual Life": "Vida Espiritual",
  "Bible Study": "Estudio Bíblico",
  "Identity": "Identidad",

  // Study categories / weekly study
  "Topics grouped into 12 life-topic categories. Check off each topic as you study it.":
    "Temas agrupados en 12 categorías de vida. Marca cada tema conforme lo estudias.",
  "A": "Un",
  "week, 14-phase sequenced study": "semanas, estudio secuenciado de 14 fases",
  "topics complete.": "temas completados.",
  Weeks: "Semanas",

  // How to use
  "A quick guide to each part of the app. Tap a section to expand it.":
    "Una guía rápida de cada parte de la aplicación. Toca una sección para expandirla.",
  "The landing screen when you first open the app — your current chapter, bookmarks and notes at a glance, today's scripture, and featured collections from Twelve Scents Publishing.":
    "La pantalla de inicio al abrir la aplicación — tu capítulo actual, marcadores y notas de un vistazo, la escritura de hoy, y colecciones destacadas de Twelve Scents Publishing.",
  "A daily home base with a greeting, the verse of the day, and quick links back into your reading. It refreshes with a new verse each time you open it.":
    "Una base diaria con un saludo, el versículo del día, y accesos rápidos a tu lectura. Se actualiza con un nuevo versículo cada vez que la abres.",
  "Tap the chapter name at the top to jump to any book or chapter. Tap a verse to highlight, bookmark, add a note, copy, or share it. A small ¹ next to a verse links to a Precepts topic for related cross-references.":
    "Toca el nombre del capítulo arriba para ir a cualquier libro o capítulo. Toca un versículo para resaltarlo, guardarlo, añadir una nota, copiarlo o compartirlo. Un pequeño ¹ junto a un versículo enlaza a un tema de Preceptos con referencias cruzadas relacionadas.",
  "Search the full text of every verse across the KJV and Apocrypha. Narrow results to specific books when you need to.":
    "Busca en el texto completo de cada versículo en la Biblia y los Apócrifos. Filtra los resultados a libros específicos cuando lo necesites.",
  "The Chronological 1-Year plan, the Sin-Specific Battles topical study, and the topic-based study plans all live here, with progress you can check off as you go.":
    "El plan Cronológico de 1 año, el estudio temático de Batallas Contra Pecados Específicos, y los planes de estudio por tema están todos aquí, con progreso que puedes marcar conforme avanzas.",
  "Every verse you've bookmarked and every note you've written, all in one place, organized for quick review.":
    "Cada versículo que has guardado y cada nota que has escrito, todo en un solo lugar, organizado para repaso rápido.",
  "Topical scripture chains — pick a theme and see every cross-reference tied to it, with a one-tap link back into the Read tab for full context.":
    "Cadenas de escritura por tema — elige un tema y ve todas las referencias cruzadas relacionadas, con un enlace directo a la pestaña Leer para el contexto completo.",
  "Toggle notifications, switch reading atmosphere (Royal Parchment, Temple Stone, Midnight Scroll), adjust font size, upload your own chapter narrations, and find About Us and Feedback.":
    "Activa o desactiva notificaciones, cambia el ambiente de lectura (Pergamino Real, Piedra del Templo, Pergamino de Medianoche), ajusta el tamaño de fuente, sube tus propias narraciones de capítulos, y encuentra Acerca de Nosotros y Comentarios.",

  // About us
  "a Twelve Scents Publishing app.": "una aplicación de Twelve Scents Publishing.",
  "We started with a simple, stubborn belief: the heroes of the Bible were brown-skinned men and women, and for too long, the books meant to introduce them to our children forgot to mention it.":
    "Comenzamos con una creencia simple y firme: los héroes de la Biblia eran hombres y mujeres de piel morena, y por demasiado tiempo, los libros destinados a presentárselos a nuestros hijos olvidaron mencionarlo.",
  "So we didn't add representation. We restored the record — heroes drawn as Scripture and history actually describe them, rooted in the 1611 King James Bible, built for a generation that deserves to see itself in its own inheritance.":
    "Así que no añadimos representación. Restauramos el registro — héroes dibujados tal como la Escritura y la historia realmente los describen, arraigados en la Biblia del Rey Jacobo de 1611, hechos para una generación que merece verse a sí misma en su propia herencia.",
  "That began as picture books. It didn't end there.": "Eso comenzó como libros ilustrados. No terminó ahí.",
  "Twelve Scents is now home to a growing family of apps": "Twelve Scents ahora es el hogar de una familia creciente de aplicaciones",
  ", each one built on the same conviction: that faith, character, and belonging should be within reach of every child of the diaspora, wherever they are and however they read.":
    ", cada una construida sobre la misma convicción: que la fe, el carácter y el sentido de pertenencia deben estar al alcance de cada niño de la diáspora, dondequiera que esté y como sea que lea.",
  "puts the full Bible in your hands — every hero, every word, ready to be read or heard in your own voice. Alongside it,":
    "pone la Biblia completa en tus manos — cada héroe, cada palabra, lista para ser leída o escuchada en tu propia voz. Junto a ella,",
  "helps you and your family navigate Scripture with clarity and purpose. And this is only the beginning; more tools for reading, teaching, and growing in faith are already on the way.":
    "te ayuda a ti y a tu familia a navegar las Escrituras con claridad y propósito. Y esto es solo el comienzo; más herramientas para leer, enseñar y crecer en la fe ya están en camino.",
  "Different apps. One publishing house. One mission, carried across every page and every screen:":
    "Aplicaciones diferentes. Una casa editorial. Una misión, llevada a través de cada página y cada pantalla:",
  '"To put a Bible hero who looks like them into the hands of every child of the diaspora — building courage, character, and belonging through stories worth reading again and again."':
    '"Poner un héroe bíblico que se parezca a ellos en las manos de cada niño de la diáspora — construyendo valentía, carácter y pertenencia a través de historias que vale la pena leer una y otra vez."',
  "The shelves were empty. We're filling them — book by book, app by app, generation by generation.":
    "Los estantes estaban vacíos. Los estamos llenando — libro por libro, aplicación por aplicación, generación tras generación.",
  "Real heroes. Real faith. Real legacy.": "Héroes reales. Fe real. Legado real.",

  // Audio narration player
  Verse: "Versículo",
  "Twelve Scents Narrator": "Narrador Twelve Scents",
  "Apple Reader": "Lector de Apple",
  "Close player": "Cerrar reproductor",
  "Twelve Scents narration isn't available for this chapter yet.":
    "La narración de Twelve Scents aún no está disponible para este capítulo.",
  "Use Apple Reader": "Usar Lector de Apple",
  "Playback couldn't continue. Please try again.": "La reproducción no pudo continuar. Inténtalo de nuevo.",
  "Playback progress": "Progreso de reproducción",
  "Loading…": "Cargando…",
  "Reading aloud — Apple Reader": "Leyendo en voz alta — Lector de Apple",
  "Previous chapter": "Capítulo anterior",
  "Previous verse": "Versículo anterior",
  "Next verse": "Versículo siguiente",
  "Next chapter": "Capítulo siguiente",
  Pause: "Pausar",
  Play: "Reproducir",
  "Playback speed": "Velocidad de reproducción",
  Narrator: "Narrador",
  "Sleep Timer": "Temporizador de Apagado",
  "Play Next Chapter Automatically": "Reproducir Siguiente Capítulo Automáticamente",
  NARRATOR: "NARRADOR",
  "APPLE READER": "LECTOR DE APPLE",
  "No installed voices found.": "No se encontraron voces instaladas.",
  "SLEEP TIMER": "TEMPORIZADOR DE APAGADO",
  Off: "Apagado",
  "15 minutes": "15 minutos",
  "30 minutes": "30 minutos",
  "45 minutes": "45 minutos",
  "60 minutes": "60 minutos",
  "End of Chapter": "Fin del Capítulo",
  "Follow Narration": "Seguir Narración",
  "Read Verse": "Leer Versículo",
  "Start Reading Here": "Comenzar a Leer Aquí",
  "Stop narration": "Detener narración",
};

// Haitian Creole (Kreyòl Ayisyen). Same keying convention as ES above.
const HT: Record<string, string> = {
  // Nav / drawer
  "Publisher's Desk": "Biwo Editè a",
  Today: "Jodi a",
  Read: "Li",
  Search: "Chèche",
  Plans: "Plan",
  Library: "Bibliyotèk",
  Precepts: "Prensip",
  "How to Use": "Kijan pou Itilize",
  Settings: "Paramèt",
  Menu: "Meni",
  "Reading Plans": "Plan Lekti",
  "Upgrade to Premium": "Pase nan Premium",
  "Unlock commentary, study tools, and more.": "Debloke kòmantè, zouti etid, ak plis ankò.",
  "Upgrade Now": "Mete Nivo Kounye a",
  "✧ DAILY VERSE ✧": "✧ VÈSÈ CHAK JOU ✧",
  "Thy word is a lamp unto my feet, and a light unto my path.":
    "Pawòl ou se yon lanp pou pye mwen, se yon limyè nan chemen mwen.",
  "KJV 1611 with Apocrypha": "Bib La (1985) ak Apokrif",
  "Coming soon": "Talè konsa",
  "Coming Soon": "Talè Konsa",

  // Header / reader
  "Continue Reading": "Kontinye Li",
  "Full text coming soon": "Tèks konplè ap vini talè",
  "Chapter text coming soon": "Tèks chapit la ap vini talè",

  // Desk screen
  "Good morning": "Bonjou",
  "Good afternoon": "Bon apremidi",
  "Good evening": "Bonswa",
  "CONTINUE READING": "KONTINYE LI",
  Bookmarks: "Siyè",
  Notes: "Nòt",
  "Today's Scripture": "Ekriti Jodi a",
  "Read Full Chapter": "Li Tout Chapit la",
  Bookmark: "Anrejistre",
  Share: "Pataje",
  "Featured Collection": "Koleksyon Vedèt",
  "Mighty Men of Valor": "Gwo Gason Vanyan",
  "Twelve portraits of courage and faith, from Gideon's three hundred to David's mighty men.":
    "Douz pòtrè kouraj ak lafwa, depi twasan mesye Jedeyon yo rive nan vanyan gason David yo.",
  "6 Books Available": "6 Liv Disponib",
  "Open Collection": "Ouvri Koleksyon an",
  "Discover Something New": "Dekouvri Yon Bagay Nouvo",
  "Sin-Specific Guide": "Gid pou Peche Espesifik",
  "Thirty-six sins named in Mark 7 and Romans 1, each paired with scripture precepts to overcome it.":
    "Trannsis peche ki nonmen nan Mak 7 ak Ròm 1, chak youn make ak prensip biblik pou simonte li.",
  "Learn More ›": "Aprann Plis ›",
  ADVERTISEMENT: "REKLAM",
  "Face Jerusalem — Always know the direction of your homeland": "Face Jerusalem — Toujou konnen direksyon peyi natal ou",
  "Get App ›": "Jwenn App la ›",
  "Enter Library": "Antre nan Bibliyotèk la",

  // Today screen
  "VERSE OF THE DAY": "VÈSÈ JOU A",
  "Read in context →": "Li nan kontèks →",

  // Search
  "Search the KJV, notes…": "Chèche nan Bib la, nòt…",
  "Full Bible": "Tout Bib la",
  Apocrypha: "Apokrif",
  "Current Book": "Liv Aktyèl la",
  "All Books": "Tout Liv",
  "Enter a text to search": "Antre yon tèks pou chèche",
  "No results for": "Pa gen rezilta pou",

  // Read screen empty state
  "isn't loaded in this build yet.": "poko chaje nan vèsyon sa a.",
  "Try Genesis 1–2, Psalm 23, or John 3.": "Eseye Jenèz 1–2, Sòm 23, oswa Jan 3.",
  "This chapter's translation isn't ready yet — showing the English text.":
    "Tradiksyon chapit sa a poko pare — n'ap montre tèks angle a.",

  // Plans
  "1-YEAR PLAN": "PLAN 1 AN",
  "Chronological Reading": "Lekti Kwonolojik",
  days: "jou",
  "TOPICAL STUDY": "ETID TEMATIK",
  "Sin-Specific Battles": "Batay Kont Peche Espesifik",
  "Sin Battles: Mark 7": "Batay Kont Peche: Mak 7",
  "Sin Battles: Romans 1": "Batay Kont Peche: Ròm 1",
  "sins from Mark 7:21-23": "peche ki nan Mak 7:21-23",
  "sins from Mark 7 & Romans 1": "peche ki nan Mak 7 ak Ròm 1",
  sins: "peche",
  "12 CATEGORIES": "12 KATEGORI",
  "Study by Category": "Etid pa Kategori",
  topics: "sijè",
  "WEEK PLAN": "PLAN SEMÈN",
  "Weekly Study Plan": "Plan Etid Chak Semèn",

  // Library
  "No bookmarks yet. Tap a verse in Read to save one.": "Poko gen siyè. Peze yon vèsè nan Li pou anrejistre yonn.",
  "No highlights yet.": "Poko gen siyalman.",
  "No notes yet.": "Poko gen nòt.",
  "+ New Note": "+ Nouvo Nòt",
  "Tap a verse, then Note to add one": "Peze yon vèsè, epi Nòt pou ajoute yonn",
  Highlights: "Siyalman",

  // Book picker
  Books: "Liv",
  "Old Testament": "Ansyen Testaman",
  "New Testament": "Nouvo Testaman",

  // Note composer
  "Note on": "Nòt sou",
  "Write your thoughts…": "Ekri panse ou…",
  "Save Note": "Anrejistre Nòt",
  "Note saved": "Nòt anrejistre",

  // Verse action bar
  "Close ✕": "Fèmen ✕",
  Copy: "Kopye",
  Save: "Anrejistre",
  Note: "Nòt",
  "Copied to clipboard": "Kopye nan papye clip",
  "KJV Narration": "Narasyon Biblik",
  "Highlight saved": "Siyalman anrejistre",
  "Highlight cleared": "Siyalman efase",
  "Bookmark removed": "Siyè retire",
  "Bookmark saved": "Siyè anrejistre",

  // Settings
  Notification: "Notifikasyon",
  Notifications: "Notifikasyon",
  "Reading Atmosphere": "Anbyans Lekti",
  ACTIVE: "AKTIF",
  "Royal Parchment": "Parchemen Wayal",
  "Temple Stone": "Wòch Tanp",
  "Midnight Scroll": "Woulo Minwi",
  "Luxury • Warm • Premium • Timeless": "Liks • Cho • Premium • San Laj",
  "Modern • Clean • Biblical • Sophisticated": "Modèn • Pwòp • Biblik • Rafine",
  "Cinematic • Focused • Premium • Easy on Eyes": "Sinematik • Konsantre • Premium • Fasil pou Je",
  "Warm daylight reading inspired by handcrafted heirloom Bibles.":
    "Lekti cho lajounen enspire pa ansyen Bib fèt ak men.",
  "Balanced study environment inspired by Jerusalem's timeless architecture.":
    "Anbyans etid ekilibre enspire pa achitekti Jerizalèm ki dire tout tan.",
  "An immersive candlelit experience designed for evening Scripture reading.":
    "Yon eksperyans limyè bouji fèt pou lekti Ekriti Sentespri nan aswè.",
  Font: "Polis",
  Language: "Lang",
  English: "Anglè",
  Español: "Panyòl",
  "Reader Font Size": "Gwosè Font Lektè",
  "Audio Narration": "Narasyon Odyo",
  "Uploaded:": "Telechaje:",
  "No custom narration uploaded": "Pa gen narasyon pèsonalize telechaje",
  "Upload Recording": "Telechaje Anrejistreman",
  Remove: "Retire",
  "Narration uploaded": "Narasyon telechaje",
  "Narration removed": "Narasyon retire",
  "Upload failed — try again": "Telechajman echwe — eseye ankò",
  "About App": "Sou App la",
  Feedback: "Kòmantè",
  "About Us": "Sou Nou",
  "Rate Us": "Evalye Nou",
  Support: "Sipò",
  "Explore the Collection": "Eksplore Koleksyon an",
  Help: "Èd",

  // About This Translation
  "About This Translation": "Sou Tradiksyon Sa a",
  "The King James Version (1611)": "Vèsyon Wa Jak la (1611)",
  "Sacred Scroll's Bible text is the King James Version, first published in 1611 under King James I of England. Commissioned from the Hebrew and Greek source texts by a team of nearly fifty scholars, it remains one of the most widely read and quoted English Bible translations in history.":
    "Tèks Bib Sacred Scroll la se Vèsyon Wa Jak la, ki te pibliye premye fwa an 1611 anba Wa Jak Premye peyi Angletè. Yon ekip prèske senkant save te fè tradiksyon an dirèkteman soti nan tèks ebre ak grèk yo. Li rete yonn nan tradiksyon Bib angle ki pi li ak ki pi site nan tout istwa.",
  "Its language has shaped English literature and worship for over four centuries, and it is the translation this app is built around, cover to cover.":
    "Langaj li a te fòme literati ak adorasyon angle pandan plis pase kat syèk, epi se tradiksyon sa a ki fè fondasyon app sa a, depi premye paj rive nan dènye paj.",
  "The Apocrypha": "Apokrif yo",
  "Alongside the 66 books of the standard Protestant canon, Sacred Scroll includes the Apocrypha — a collection of historical, wisdom, and devotional books that appeared in the original 1611 King James Bible.":
    "Anplis 66 liv kanon Pwotestan estanda a, Sacred Scroll enkli Apokrif yo — yon koleksyon liv istorik, liv sajès, ak liv devosyon ki te parèt nan Bib Wa Jak orijinal 1611 la.",
  "These books were part of English Bibles for centuries before later editions removed them. We include them here as they were originally printed, for readers who want the complete 1611 text.":
    "Liv sa yo te fè pati Bib angle yo pandan plizyè syèk anvan edisyon pita retire yo. Nou enkli yo isit la jan yo te enprime orijinèlman, pou lektè ki vle tèks konplè 1611 la.",

  // Chrono detail
  "The whole Bible in one year, ordered by when events happened":
    "Tout Bib la nan yon sèl ane, aranje dapre lè evènman yo te rive",
  of: "sou",
  "days complete.": "jou fin fèt.",
  Weekly: "Chak Semèn",
  Monthly: "Chak Mwa",
  Quarterly: "Chak Trimès",
  Yearly: "Chak Ane",
  "YEAR PROGRESS": "PWOGRE ANE A",
  "days read": "jou li",
  Quarter: "Trimès",
  Days: "Jou",
  Week: "Semèn",
  Day: "Jou",

  // Sin battles
  "MARK 7:21-23": "MAK 7:21-23",
  "Mark 7:21-23 — for out of the heart proceed evil thoughts, adulteries, fornications, murders, thefts, covetousness, wickedness, deceit, lasciviousness, an evil eye, blasphemy, pride, foolishness. For each, at least three precepts to overcome.":
    "Mak 7:21-23 — paske se nan kè moun move panse soti: adiltè, fònikasyon, touye moun, vòl, konvwatiz, mechanste, twonpri, imoralite, move je, blasfèm, ògèy, foli. Pou chak youn, omwen twa prensip pou simonte li.",
  "ROMANS 1:29-31": "RÒM 1:29-31",
  "Romans 1:29-31 — being filled with all unrighteousness, fornication, wickedness, covetousness, maliciousness; full of envy, murder, debate, deceit, malignity; whisperers, backbiters, haters of God, despiteful, proud, boasters, inventors of evil things, disobedient to parents, without understanding, covenantbreakers, without natural affection, implacable, unmerciful. For each, at least three precepts to overcome.":
    "Ròm 1:29-31 — plen ak tout enjistis, fònikasyon, mechanste, konvwatiz, malveyans; plen ak jalouzi, touye moun, kont, twonpri, movèz fwa; medizan, kalomniyatè, moun ki rayi Bondye, awogan, ògeye, vantad, envantè bagay mal, dezobeyisan anvè paran, san konprann, moun ki pa kenbe pawòl yo, san afeksyon natirèl, san pitye, san mizèrikòd. Pou chak youn, omwen twa prensip pou simonte li.",

  // Precepts
  "Topical scripture chains. Each topic's key verse is highlighted in the Read tab with a ¹ footnote linking the rest of the chain.":
    "Chèn ekriti pa sijè. Vèsè kle chak sijè make nan tab Li a ak yon nòt ¹ ki lye rès chèn nan.",
  "View in Reader": "Gade nan Lektè a",
  "A–Z TOPICS": "SIJÈ A–Z",
  "FEATURED TOPICS": "SIJÈ VEDÈT",
  "Hand-picked topics to start with, grouped by theme.": "Sijè chwazi espesyalman pou kòmanse, gwoupe pa tèm.",
  "Relationships & Family": "Relasyon & Fanmi",
  "Spiritual Life": "Lavi Espirityèl",
  "Bible Study": "Etid Biblik",
  "Identity": "Idantite",

  // Study categories / weekly study
  "Topics grouped into 12 life-topic categories. Check off each topic as you study it.":
    "Sijè yo gwoupe an 12 kategori sou lavi. Tcheke chak sijè apre ou fin etidye li.",
  "A": "Yon",
  "week, 14-phase sequenced study": "semèn, etid ki gen 14 faz nan lòd",
  "topics complete.": "sijè fin fèt.",
  Weeks: "Semèn",

  // How to use
  "A quick guide to each part of the app. Tap a section to expand it.":
    "Yon gid rapid pou chak pati nan app la. Peze yon seksyon pou louvri li.",
  "The landing screen when you first open the app — your current chapter, bookmarks and notes at a glance, today's scripture, and featured collections from Twelve Scents Publishing.":
    "Ekran ki parèt lè ou premye ouvri app la — chapit aktyèl ou, siyè ak nòt ou yo yon sèl kout je, ekriti jodi a, ak koleksyon vedèt Twelve Scents Publishing.",
  "A daily home base with a greeting, the verse of the day, and quick links back into your reading. It refreshes with a new verse each time you open it.":
    "Yon baz chak jou ak yon salitasyon, vèsè jou a, ak lyen rapid pou tounen nan lekti ou. Li chanje ak yon nouvo vèsè chak fwa ou louvri li.",
  "Tap the chapter name at the top to jump to any book or chapter. Tap a verse to highlight, bookmark, add a note, copy, or share it. A small ¹ next to a verse links to a Precepts topic for related cross-references.":
    "Peze non chapit la anlè a pou ale nan nenpòt liv oswa chapit. Peze yon vèsè pou siyale li, anrejistre li, ajoute yon nòt, kopye li, oswa pataje li. Yon ti ¹ akote yon vèsè lye ak yon sijè Prensip pou referans ki gen rapò.",
  "Search the full text of every verse across the KJV and Apocrypha. Narrow results to specific books when you need to.":
    "Chèche tout tèks chak vèsè nan Bib la ak Apokrif yo. Filtre rezilta yo pou liv espesifik lè ou bezwen.",
  "The Chronological 1-Year plan, the Sin-Specific Battles topical study, and the topic-based study plans all live here, with progress you can check off as you go.":
    "Plan Kwonolojik 1 An an, etid tematik Batay Kont Peche yo, ak plan etid pa sijè yo tout la, ak pwogre ou ka tcheke pandan w'ap avanse.",
  "Every verse you've bookmarked and every note you've written, all in one place, organized for quick review.":
    "Chak vèsè ou siyale ak chak nòt ou ekri, tout nan yon sèl kote, aranje pou revizyon rapid.",
  "Topical scripture chains — pick a theme and see every cross-reference tied to it, with a one-tap link back into the Read tab for full context.":
    "Chèn ekriti pa sijè — chwazi yon tèm epi wè tout referans ki lye ak li, ak yon lyen yon sèl peze pou tounen nan tab Li a pou gen kontèks konplè.",
  "Toggle notifications, switch reading atmosphere (Royal Parchment, Temple Stone, Midnight Scroll), adjust font size, upload your own chapter narrations, and find About Us and Feedback.":
    "Aktive oswa dezaktive notifikasyon, chanje anbyans lekti (Parchemen Wayal, Wòch Tanp, Woulo Minwi), ajiste gwosè font, telechaje pwòp narasyon chapit ou, epi jwenn Sou Nou ak Kòmantè.",

  // About us
  "a Twelve Scents Publishing app.": "yon app Twelve Scents Publishing.",
  "We started with a simple, stubborn belief: the heroes of the Bible were brown-skinned men and women, and for too long, the books meant to introduce them to our children forgot to mention it.":
    "Nou te kòmanse ak yon kwayans senp men tèti: ewo Bib la se te gason ak fanm ak po mawon, e pandan twòp tan, liv ki te sipoze prezante yo bay pitit nou yo te bliye mansyone sa.",
  "So we didn't add representation. We restored the record — heroes drawn as Scripture and history actually describe them, rooted in the 1611 King James Bible, built for a generation that deserves to see itself in its own inheritance.":
    "Se poutèt sa nou pa t' ajoute reprezantasyon. Nou te restore verite a — ewo desine jan Ekriti Sentespri ak istwa dekri yo tout bon, ki gen rasin nan Bib Wa Jak 1611 la, fèt pou yon jenerasyon ki merite wè tèt li nan pwòp eritaj li.",
  "That began as picture books. It didn't end there.": "Sa te kòmanse kòm liv imaj. Li pa t' fini la.",
  "Twelve Scents is now home to a growing family of apps": "Twelve Scents kounye a se kay yon fanmi app k'ap grandi",
  ", each one built on the same conviction: that faith, character, and belonging should be within reach of every child of the diaspora, wherever they are and however they read.":
    ", chak youn bati sou menm konviksyon an: lafwa, karaktè, ak sans apatenans ta dwe alapòte tout timoun dyaspora a, kèlkeswa kote yo ye ak jan yo li.",
  "puts the full Bible in your hands — every hero, every word, ready to be read or heard in your own voice. Alongside it,":
    "mete tout Bib la nan men ou — chak ewo, chak pawòl, pare pou li oswa tande nan pwòp vwa ou. Akote li,",
  "helps you and your family navigate Scripture with clarity and purpose. And this is only the beginning; more tools for reading, teaching, and growing in faith are already on the way.":
    "ede ou ak fanmi ou navige nan Ekriti Sentespri ak klète ak objektif. Epi sa se sèlman kòmansman an; plis zouti pou li, anseye, ak grandi nan lafwa deja sou wout.",
  "Different apps. One publishing house. One mission, carried across every page and every screen:":
    "Diferan app. Yon sèl kay piblikasyon. Yon sèl misyon, pote nan chak paj ak chak ekran:",
  '"To put a Bible hero who looks like them into the hands of every child of the diaspora — building courage, character, and belonging through stories worth reading again and again."':
    '"Mete yon ewo Bib ki sanble ak yo nan men chak timoun dyaspora a — bati kouraj, karaktè, ak sans apatenans atravè istwa ki vo lapenn li ankò e ankò."',
  "The shelves were empty. We're filling them — book by book, app by app, generation by generation.":
    "Etajè yo te vid. N'ap ranpli yo — liv pa liv, app pa app, jenerasyon pa jenerasyon.",
  "Real heroes. Real faith. Real legacy.": "Vrè ewo. Vrè lafwa. Vrè eritaj.",

  // Audio narration player
  Verse: "Vèsè",
  "Twelve Scents Narrator": "Narratè Twelve Scents",
  "Apple Reader": "Lektè Apple",
  "Close player": "Fèmen lektè a",
  "Twelve Scents narration isn't available for this chapter yet.":
    "Narasyon Twelve Scents pa disponib pou chapit sa a ankò.",
  "Use Apple Reader": "Itilize Lektè Apple",
  "Playback couldn't continue. Please try again.": "Repwodiksyon an pa t' ka kontinye. Tanpri eseye ankò.",
  "Playback progress": "Pwogre repwodiksyon",
  "Loading…": "Ap chaje…",
  "Reading aloud — Apple Reader": "L'ap li a wòt vwa — Lektè Apple",
  "Previous chapter": "Chapit anvan",
  "Previous verse": "Vèsè anvan",
  "Next verse": "Pwochen vèsè",
  "Next chapter": "Pwochen chapit",
  Pause: "Fè Poz",
  Play: "Jwe",
  "Playback speed": "Vitès repwodiksyon",
  Narrator: "Narratè",
  "Sleep Timer": "Minitè Dòmi",
  "Play Next Chapter Automatically": "Jwe Pwochen Chapit Otomatikman",
  NARRATOR: "NARRATÈ",
  "APPLE READER": "LEKTÈ APPLE",
  "No installed voices found.": "Pa gen vwa enstale yo jwenn.",
  "SLEEP TIMER": "MINITÈ DÒMI",
  Off: "Etenn",
  "15 minutes": "15 minit",
  "30 minutes": "30 minit",
  "45 minutes": "45 minit",
  "60 minutes": "60 minit",
  "End of Chapter": "Fen Chapit la",
  "Follow Narration": "Swiv Narasyon",
  "Read Verse": "Li Vèsè",
  "Start Reading Here": "Kòmanse Li Isit",
  "Stop narration": "Sispann narasyon",
};

let _lang: Language = "en";

export function setUiLanguage(lang: Language) {
  _lang = lang;
}

export function getUiLanguage(): Language {
  return _lang;
}

const DICTS: Partial<Record<Language, Record<string, string>>> = { es: ES, ht: HT };

/** Translates a UI string keyed by its English source text. Falls back to the
 * English input unchanged if there's no entry for it yet in that language. */
export function translate(lang: Language, s: string): string {
  return DICTS[lang]?.[s] ?? s;
}
