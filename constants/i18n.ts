export type Language = "en" | "es";

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
  "Reading Plans": "Planes de Lectura",
  "Upgrade to Premium": "Mejorar a Premium",
  "Unlock commentary, study tools, and more.": "Desbloquea comentarios, herramientas de estudio y más.",
  "Upgrade Now": "Mejorar Ahora",
  "✧ DAILY VERSE ✧": "✧ VERSÍCULO DIARIO ✧",
  "Thy word is a lamp unto my feet, and a light unto my path.":
    "Lámpara es a mis pies tu palabra, y lumbrera á mi camino.",
  "KJV 1611 with Apocrypha": "Reina-Valera 1909 con Apócrifos",
  "Coming soon": "Próximamente",

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
  "Psalms & Proverbs Study Guide": "Guía de Estudio de Salmos y Proverbios",
  "A companion volume for daily reflection, newly added to the catalog.":
    "Un volumen complementario para la reflexión diaria, recién añadido al catálogo.",
  "Learn More ›": "Más Información ›",
  ADVERTISEMENT: "PUBLICIDAD",
  "Face Jerusalem — find true north to the Holy City": "Face Jerusalem — encuentra el norte verdadero hacia la Ciudad Santa",
  "Get App ›": "Obtener App ›",
  "Enter Library →": "Entrar a la Biblioteca →",

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
  "This chapter's Spanish translation isn't ready yet — showing the English text.":
    "La traducción al español de este capítulo aún no está lista — mostrando el texto en inglés.",

  // Plans
  "1-YEAR PLAN": "PLAN DE 1 AÑO",
  "Chronological Reading": "Lectura Cronológica",
  "days": "días",
  "TOPICAL STUDY": "ESTUDIO TEMÁTICO",
  "Sin-Specific Battles": "Batallas Contra Pecados Específicos",
  "sins from Mark 7:21-23": "pecados de Marcos 7:21-23",
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
  "More App": "Más Apps",
  Help: "Ayuda",

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
  "Mark 7:21-23 — for out of the heart proceed evil thoughts, adulteries, fornications, murders, thefts, covetousness, wickedness, deceit, lasciviousness, an evil eye, blasphemy, pride, foolishness. For each, at least three precepts to overcome.":
    "Marcos 7:21-23 — porque de dentro, del corazón de los hombres, salen los malos pensamientos, los adulterios, las fornicaciones, los homicidios, los hurtos, las avaricias, las maldades, el engaño, la lascivia, el ojo maligno, la blasfemia, la soberbia, la insensatez. Para cada uno, al menos tres preceptos para vencerlo.",

  // Precepts
  "Topical scripture chains. Each topic's key verse is highlighted in the Read tab with a ¹ footnote linking the rest of the chain.":
    "Cadenas de escritura por tema. El versículo clave de cada tema se resalta en la pestaña Leer con una nota ¹ que enlaza el resto de la cadena.",
  "View in Reader": "Ver en el Lector",

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

let _lang: Language = "en";

export function setUiLanguage(lang: Language) {
  _lang = lang;
}

export function getUiLanguage(): Language {
  return _lang;
}

/** Translates a UI string keyed by its English source text. Falls back to the
 * English input unchanged if there's no Spanish entry for it yet. */
export function translate(lang: Language, s: string): string {
  if (lang === "es") return ES[s] ?? s;
  return s;
}
