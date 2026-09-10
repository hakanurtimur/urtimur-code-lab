import type { CurriculumModule, LessonTest } from "../../types";
import { makeLesson, makeWeek } from "./helpers";

const selector = (id: string, label: string, css: string): LessonTest => ({
  id,
  label,
  kind: "selector",
  selector: css,
});

const count = (id: string, label: string, css: string, min: number): LessonTest => ({
  id,
  label,
  kind: "selector-count",
  selector: css,
  min,
});

const attribute = (
  id: string,
  label: string,
  css: string,
  name: string,
  value: string,
): LessonTest => ({ id, label, kind: "attribute", selector: css, attribute: name, value });

const doctype = (id = "doctype", label = "DOCTYPE tanımlı"): LessonTest => ({
  id,
  label,
  kind: "doctype",
});

const structure = (id = "structure", label = "HTML belge iskeleti doğru sırada"): LessonTest => ({
  id,
  label,
  kind: "document-structure",
});

const week1 = makeWeek({
  order: 1,
  title: "HTML Tamir Atölyesi",
  theme: "Arızalı Robot Profili",
  summary:
    "İlk hafta HTML elementlerini, açılış-kapanış mantığını ve attribute kavramını hata ayıklayarak sağlamlaştırır. FCC tarafında geldiğiniz mevcut nokta burasıdır.",
  weeklyBuild: "Bozuk bir robot profil sayfasını okuyup kendi başına çalışır hale getirmek.",
  fccStatus: "completed",
  fccSteps: { start: 1, end: 15, total: 137 },
  fccBlocks: [
    { title: "Build a Curriculum Outline", type: "Workshop", scope: "11 step" },
    { title: "Debug Camperbot's Profile Page", type: "Lab", scope: "1 step" },
    { title: "Understanding HTML Attributes", type: "Theory", scope: "2 step" },
    { title: "Debug a Pet Adoption Page", type: "Lab", scope: "1 step" },
  ],
  outcomes: [
    "HTML'in bir web sayfasındaki yapı ve içerik görevini açıklayabilir.",
    "Açılış ve kapanış etiketlerini kullanarak temel metin elementleri yazabilir.",
    "Bozuk veya yanlış yazılmış HTML elementlerini fark edip düzeltebilir.",
    "Attribute ile element arasındaki farkı ve href, src, alt gibi temel attribute'ları açıklayabilir.",
    "Void elementlerin normal elementlerden farkını tanıyabilir.",
  ],
  lessons: [
    makeLesson(1, 1, {
      id: "w1-robot-profile-debug",
      title: "Arızalı Robot Profili",
      description:
        "Bir bakım robotunun bozulmuş profil ekranını tamir et. Burada amaç etiketi ezberlemek değil, kodu okuyup hatayı görebilmek.",
      fccCheckpoint:
        "FCC: Build a Curriculum Outline + Debug Camperbot's Profile Page tamamlandıktan sonra çöz.",
      outcomes: [
        "h1, h2 ve p elementlerini doğru açıp kapatabilir.",
        "Geçersiz element adlarını standart HTML elementleriyle değiştirebilir.",
        "Bir elementin başlangıç ve bitiş sınırlarını kod içinde takip edebilir.",
        "Metin hiyerarşisinde ana başlık ile alt başlığı ayırt edebilir.",
        "Basit markup hatalarını tarayıcı önizlemesi ve kodu birlikte okuyarak düzeltebilir.",
      ],
      quickRecall: [
        ["Bir ana başlık için hangi elementi kullanırız?", "h1. Bir sayfanın ana başlığı genellikle bir h1 ile ifade edilir."],
        ["<p> neyi temsil eder?", "Bir paragrafı; yani metinsel bir içerik bloğunu."],
        ["Neden <heading1> yazmıyoruz?", "Çünkü tarayıcıların bildiği standart heading elementleri h1 ile h6 arasındadır."],
      ],
      practice: {
        title: "Practice · Hata Avı",
        description: "Kodda standart olmayan elementleri bul ve doğru HTML karşılıklarıyla değiştir.",
        requirements: ["Ana başlığı düzelt.", "Alt başlığı düzelt.", "Açıklama metnini gerçek bir paragraf yap."],
      },
      challenge: {
        title: "Challenge · Sessiz Arıza",
        description: "Önizlemede garip görünen fakat ilk bakışta fark edilmeyen markup hatalarını temizle.",
        requirements: ["Etiket çiftlerini kontrol et.", "Başlık seviyelerini mantıklı sıraya getir.", "Metinleri elementlerin dışında bırakma."],
      },
      miniBuild: {
        title: "Mini Build · R-13 Durum Kartı",
        description: "R-13 isimli hayali robot için küçük bir bakım durumu kartı oluştur.",
        requirements: ["Bir h1 kullan.", "En az bir h2 kullan.", "En az iki paragraf ekle."],
      },
      starterCode: `<heading1>R-13 Bakım Kaydı</heading1>\n<h2>Durum</h2>\n<pp>Sol motor kalibrasyon bekliyor.</pp>\n<p>Batarya seviyesi yüzde 82.</p>`,
      tests: [
        selector("h1", "Bir h1 ana başlığı var", "h1"),
        selector("h2", "Bir h2 alt başlığı var", "h2"),
        count("paragraphs", "En az iki paragraf var", "p", 2),
      ],
    }),
    makeLesson(1, 2, {
      id: "w1-attribute-detective",
      title: "Attribute Dedektifi",
      description:
        "Bir elementin ne olduğunu ve attribute'ların o elemente hangi ek bilgiyi verdiğini ayırmayı öğren.",
      fccCheckpoint: "FCC: Understanding HTML Attributes tamamlandıktan sonra çöz.",
      outcomes: [
        "Attribute adı ile değerini birbirinden ayırabilir.",
        "src attribute'unun medya kaynağını belirlediğini açıklayabilir.",
        "alt attribute'unun görsel için metinsel alternatif sağladığını açıklayabilir.",
        "href attribute'unun bağlantının hedefini belirlediğini tanıyabilir.",
        "Boolean attribute kavramını temel düzeyde açıklayabilir.",
      ],
      quickRecall: [
        ["src ne işe yarar?", "Bir görsel veya medya elementinin kaynağını belirtir."],
        ["alt neden yalnızca süs değildir?", "Görsel görülemediğinde ya da ekran okuyucu kullanıldığında anlamı metinle taşır."],
        ["Attribute nerede yazılır?", "Genellikle elementin açılış etiketinin içinde."],
      ],
      practice: {
        title: "Practice · Etiketleri Donat",
        description: "Eksik attribute'ları tamamlayarak bir keşif robotu görselini ve bağlantısını anlamlı hale getir.",
        requirements: ["Görsele src ekle.", "Görsele açıklayıcı alt ekle.", "Bağlantıya href ekle."],
      },
      challenge: {
        title: "Challenge · Kaynak mı Hedef mi?",
        description: "src ve href'in yerlerini karıştırılmış kodda düzelt.",
        requirements: ["Görsel kaynağı src ile verilmeli.", "Bağlantı hedefi href ile verilmeli.", "Attribute değerlerini tırnak içinde tut."],
      },
      miniBuild: {
        title: "Mini Build · Keşif Kartı",
        description: "Bir uzay aracının görselini ve görev bağlantısını tek kartta birleştir.",
        requirements: ["Bir img elementi ekle.", "Anlamlı alt metni yaz.", "Bir a elementi ve href kullan."],
      },
      starterCode: `<h1>Keşif Birimi K-7</h1>\n<img src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80">\n<p>K-7 uzak yüzeylerde veri toplar.</p>\n<a>Görev merkezine git</a>`,
      tests: [
        selector("img", "Bir görsel var", "img"),
        selector("alt", "Görselde alt açıklaması var", "img[alt]"),
        selector("href", "Bir bağlantı hedefi var", "a[href]"),
      ],
    }),
    makeLesson(1, 3, {
      id: "w1-html-repair-station",
      title: "HTML Tamir İstasyonu",
      description:
        "İlk haftanın konularını tek bir bozuk ekran üzerinde birleştir. Ne düzelteceğini sistem değil, kodun kendisi söyleyecek.",
      fccCheckpoint: "FCC: Debug a Pet Adoption Page tamamlandıktan sonra çöz.",
      outcomes: [
        "Standart olmayan elementleri tespit edebilir.",
        "Yanlış attribute kullanımını düzeltebilir.",
        "Void elementleri doğru biçimde kullanabilir.",
        "Basit nesting problemlerini okuyabilir.",
        "Birden fazla HTML hatasını sistematik biçimde ayıklayabilir.",
      ],
      quickRecall: [
        ["img için </img> gerekir mi?", "Hayır. img bir void elementtir ve kapanış etiketi kullanmaz."],
        ["Bir linkin hedefini hangi attribute belirler?", "href."],
        ["Debug ederken ilk neye bakarsın?", "Element adları, açılış-kapanış eşleşmeleri ve attribute'ların doğru elementte olup olmadığı iyi başlangıç noktalarıdır."],
      ],
      practice: {
        title: "Practice · Üç Hata",
        description: "Bakım ekranındaki üç farklı HTML hatasını bul.",
        requirements: ["Başlık elementini düzelt.", "Görsele alt ekle.", "Bağlantıya href ekle."],
      },
      challenge: {
        title: "Challenge · Yardımsız Tamir",
        description: "Kodun tamamını tara ve markup'ın mantıklı bir belge parçası olmasını sağla.",
        requirements: ["Geçersiz element bırakma.", "Görsel erişilebilir olsun.", "Bağlantı gerçekten tıklanabilir olsun."],
      },
      miniBuild: {
        title: "Mini Build · Servis Panosu",
        description: "Bir robot servis panosu oluştur: başlık, açıklama, görsel ve teknik doküman bağlantısı.",
        requirements: ["Bir h1 kullan.", "En az iki p kullan.", "img + alt ekle.", "a + href ekle."],
      },
      starterCode: `<title1>Servis Panosu</title1>\n<p>Bugün kontrol edilen robot: AX-4</p>\n<img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80">\n<p>Durum: test sürüşüne hazır.</p>\n<a>Teknik dokümanı aç</a>`,
      tests: [
        selector("h1", "Servis panosunun ana başlığı var", "h1"),
        count("p", "En az iki paragraf var", "p", 2),
        selector("img-alt", "Görsel erişilebilir bir alt açıklamasına sahip", "img[alt]"),
        selector("link", "Teknik doküman bağlantısında href var", "a[href]"),
      ],
    }),
  ],
});

const week2 = makeWeek({
  order: 2,
  title: "Görev Dosyası",
  theme: "Mars Rover Dosyası",
  summary:
    "Belge iskeletini kurar; görsel, link ve nesting bilgisini bir uzay görevi dosyası üzerinden uygular. FCC'de sıradaki aktif hafta budur.",
  weeklyBuild: "Bir Mars rover için tam belge yapısına sahip, görselli ve bağlantılı görev profili oluşturmak.",
  fccStatus: "current",
  fccSteps: { start: 16, end: 35, total: 137 },
  fccBlocks: [
    { title: "Understanding the HTML Boilerplate", type: "Theory", scope: "3 step" },
    { title: "Build a Cat Photo App", type: "Workshop", scope: "Step 1–17" },
  ],
  outcomes: [
    "Temel HTML boilerplate yapısını sıfırdan kurabilir.",
    "head içeriği ile body içeriğinin görevlerini ayırabilir.",
    "img, src ve alt kullanarak anlamlı görsel ekleyebilir.",
    "a, href ve target kullanarak bağlantı oluşturabilir.",
    "Bir elementi başka bir elementin içine doğru biçimde nest edebilir.",
  ],
  lessons: [
    makeLesson(2, 1, {
      id: "w2-mission-document-shell",
      title: "Görev Dosyasının İskeleti",
      description: "Bir uzay görev dosyasını tarayıcının anlayacağı gerçek bir HTML belgesine dönüştür.",
      fccCheckpoint: "FCC: Understanding the HTML Boilerplate tamamlandıktan sonra çöz.",
      outcomes: [
        "DOCTYPE bildiriminin amacını açıklayabilir.",
        "html, head ve body elementlerini doğru sırada kurabilir.",
        "lang attribute'u ile belge dilini belirleyebilir.",
        "title elementini head içinde kullanabilir.",
        "UTF-8 karakter setini meta elementiyle tanımlayabilir.",
      ],
      quickRecall: [
        ["Kullanıcının gördüğü ana içerik nerede bulunur?", "body elementi içinde."],
        ["Tarayıcı sekmesindeki başlık hangi elementten gelir?", "head içindeki title elementinden."],
        ["UTF-8 neden işimize yarar?", "Türkçe karakterler dahil çok geniş bir karakter kümesini doğru temsil etmeye yardımcı olur."],
      ],
      practice: {
        title: "Practice · Eksik İskelet",
        description: "Parçaları verilen görev belgesini doğru sıraya getir.",
        requirements: ["DOCTYPE ekle.", "html/head/body yapısını kur.", "title ve charset meta ekle."],
      },
      challenge: {
        title: "Challenge · Boş Dosyadan Başla",
        description: "Yalnızca görev adı veriliyor. Tam HTML belgesini kendin kur.",
        requirements: ["lang=tr kullan.", "title head içinde olsun.", "İçerik body içinde olsun."],
      },
      miniBuild: {
        title: "Mini Build · Mars Görev Dosyası",
        description: "Mars görevi için geçerli bir document shell ve bir ana başlık oluştur.",
        requirements: ["DOCTYPE.", "Doğru document structure.", "UTF-8.", "Türkçe dil tanımı.", "Bir h1."],
      },
      starterCode: `<h1>ARES-9 Mars Görevi</h1>\n<p>Görev dosyası hazırlanıyor...</p>`,
      tests: [
        doctype(),
        structure(),
        attribute("lang", "Belge dili Türkçe", "html", "lang", "tr"),
        selector("charset", "UTF-8 karakter seti tanımlı", 'meta[charset="UTF-8"], meta[charset="utf-8"]'),
        selector("h1", "Görev adı h1 ile yazılmış", "h1"),
      ],
    }),
    makeLesson(2, 2, {
      id: "w2-rover-gallery",
      title: "Mars Rover Galerisi",
      description: "Bir rover profilini görsel, açıklama ve dış bağlantıyla zenginleştir.",
      fccCheckpoint: "FCC: Build a Cat Photo App içinde link ve image adımlarına geldikten sonra çöz.",
      outcomes: [
        "img elementine doğru src verebilir.",
        "Görselin amacını anlatan alt metni yazabilir.",
        "a elementine href vererek dış bağlantı oluşturabilir.",
        "target=_blank ile yeni sekmede açılan bağlantı oluşturabilir.",
        "Bir görselin içerik içindeki rolünü metinle birlikte planlayabilir.",
      ],
      quickRecall: [
        ["Görsel yüklenemezse hangi metin devreye girer?", "alt attribute'undaki metin."],
        ["Yeni sekme için hangi target değeri kullanılır?", "_blank."],
        ["href ile src aynı şey mi?", "Hayır. href bir bağlantının hedefini, src ise gömülen kaynağın konumunu belirtir."],
      ],
      practice: {
        title: "Practice · Rover Fotoğrafı",
        description: "Eksik profil kartına erişilebilir görsel ve görev merkezi bağlantısı ekle.",
        requirements: ["img ekle.", "alt yaz.", "Dış bağlantıyı yeni sekmede aç."],
      },
      challenge: {
        title: "Challenge · Anlamlı Alt",
        description: "Alt metni 'resim' gibi anlamsız bir ifadeyle geçiştirme; görüntünün ne anlattığını yaz.",
        requirements: ["Alt metin roverı tanımlasın.", "Bağlantı href içersin.", "target _blank olsun."],
      },
      miniBuild: {
        title: "Mini Build · ARES-9 Profil Kartı",
        description: "Rover adı, görseli, görev açıklaması ve araştırma merkezi linkinden oluşan profil hazırla.",
        requirements: ["h1.", "img + alt.", "p.", "a + href + target=_blank."],
      },
      starterCode: `<h1>ARES-9</h1>\n<p>ARES-9, krater yüzeylerini analiz eden otonom bir rover.</p>`,
      tests: [
        selector("img", "Rover görseli var", "img[src]"),
        selector("alt", "Rover görselinde alt açıklaması var", "img[alt]"),
        selector("link", "Görev merkezi bağlantısı var", "a[href]"),
        attribute("target", "Bağlantı yeni sekmede açılıyor", "a[href]", "target", "_blank"),
      ],
    }),
    makeLesson(2, 3, {
      id: "w2-clickable-discovery-map",
      title: "Tıklanabilir Keşif Haritası",
      description: "Bir görseli bağlantının içine yerleştirerek tıklanabilir keşif noktası oluştur.",
      fccCheckpoint: "FCC: Build a Cat Photo App Step 17 civarına ulaştıktan sonra çöz.",
      outcomes: [
        "Parent ve child element ilişkisini açıklayabilir.",
        "Bir img elementini a elementinin içine nest edebilir.",
        "main elementini ana içerik alanı olarak kullanabilir.",
        "Bağlantı ve görsel attribute'larını aynı yapı içinde doğru tutabilir.",
        "Nesting'i girintileme ile okunabilir hale getirebilir.",
      ],
      quickRecall: [
        ["Bir görseli tıklanabilir yapmak için temel fikir nedir?", "img elementini bir a elementinin içine yerleştirmek."],
        ["main neyi temsil eder?", "Sayfanın ana ve benzersiz içeriğini."],
        ["Girintileme tarayıcı için zorunlu mu?", "Çoğunlukla hayır; fakat insanın nesting yapısını doğru okuması için çok değerlidir."],
      ],
      practice: {
        title: "Practice · Görseli Linke Dönüştür",
        description: "Rover görselini görev detay sayfasına giden bağlantının içine al.",
        requirements: ["a parent olsun.", "img a içinde child olsun.", "Yapı main içinde yer alsın."],
      },
      challenge: {
        title: "Challenge · Kırık Nesting",
        description: "Kapanış etiketleri karıştırılmış bir yapıyı okunabilir ve doğru nesting'e getir.",
        requirements: ["a img selectorü oluşmalı.", "main ana içeriği sarmalı.", "Görsel alt metnini koru."],
      },
      miniBuild: {
        title: "Mini Build · Keşif Noktası",
        description: "Tıklanınca görevin detaylarına götüren bir yüzey fotoğrafı oluştur.",
        requirements: ["main kullan.", "a içinde img kullan.", "href ve alt attribute'larını ekle."],
      },
      starterCode: `<main>\n  <h1>ARES-9 Keşif Haritası</h1>\n  <p>Detayları görmek için yüzey görüntüsüne tıkla.</p>\n</main>`,
      tests: [
        selector("main", "Ana içerik main içinde", "main"),
        selector("nested-image", "Görsel bir bağlantının içine yerleştirilmiş", "a[href] img[src][alt]"),
      ],
    }),
  ],
});

const week3 = makeWeek({
  order: 3,
  title: "İçeriği Organize Et",
  theme: "Oyun Arşivi",
  summary:
    "Sayfayı anlamlı bölümlere ayırır; listeleri, figure yapısını ve vurgu elementlerini içerik hiyerarşisi içinde kullanır.",
  weeklyBuild: "Favori oyunlardan oluşan bölümlü, listeli ve açıklamalı bir mini arşiv oluşturmak.",
  fccStatus: "upcoming",
  fccSteps: { start: 36, end: 52, total: 137 },
  fccBlocks: [{ title: "Build a Cat Photo App", type: "Workshop", scope: "Step 18–34" }],
  outcomes: [
    "Bir sayfayı anlamlı section bloklarına ayırabilir.",
    "ul, ol ve li yapılarını doğru senaryoda kullanabilir.",
    "figure ve figcaption ile görsel ve açıklamasını ilişkilendirebilir.",
    "strong ve em elementlerini semantik vurgu için kullanabilir.",
    "Parent-child ve sibling ilişkilerini HTML ağacında okuyabilir.",
  ],
  lessons: [
    makeLesson(3, 1, {
      id: "w3-game-archive-sections",
      title: "Oyun Arşivi Bölümleri",
      description: "Tek parça içerik yerine arşivi anlamlı section'lara böl ve başlık hiyerarşisi kur.",
      fccCheckpoint: "FCC: Cat Photo App içinde section kullanımına ulaştıktan sonra çöz.",
      outcomes: [
        "section elementinin içerik gruplama amacını açıklayabilir.",
        "Birden fazla section'ı main altında sibling olarak kurabilir.",
        "Her section'a anlamlı heading verebilir.",
        "h1, h2 ve h3 seviyelerini içerik hiyerarşisine göre seçebilir.",
        "Büyük bir içeriği okunabilir alt bölümlere ayırabilir.",
      ],
      quickRecall: [
        ["İki section aynı main altında duruyorsa ilişkileri nedir?", "Birbirlerinin sibling'idir."],
        ["Her bölümün başlığını neden düşünmeliyiz?", "Bölümün ne hakkında olduğunu kullanıcıya ve yardımcı teknolojilere açıklar."],
        ["Her şeyi div ile bölmek zorunda mıyız?", "Hayır. Anlamlı bir bölüm söz konusuysa section gibi daha açıklayıcı elementler tercih edilebilir."],
      ],
      practice: {
        title: "Practice · Arşivi Böl",
        description: "Aksiyon ve strateji oyunlarını iki ayrı section içine taşı.",
        requirements: ["main kullan.", "En az iki section oluştur.", "Her section içinde heading bulunsun."],
      },
      challenge: {
        title: "Challenge · Başlık Haritası",
        description: "Başlık seviyelerini içerik ilişkisine göre yeniden düzenle.",
        requirements: ["Tek ana h1 kullan.", "Bölümler için h2 kullan.", "Gerekirse alt öğelerde h3 kullan."],
      },
      miniBuild: {
        title: "Mini Build · Oyun Arşivi",
        description: "İki kategoriden oluşan küçük bir oyun arşivinin HTML iskeletini kur.",
        requirements: ["main.", "2 section.", "1 h1 ve en az 2 h2."],
      },
      starterCode: `<main>\n  <h1>Oyun Arşivim</h1>\n  <p>Oynarken en çok zaman geçirdiğim türler.</p>\n</main>`,
      tests: [
        selector("main", "Ana içerik main içinde", "main"),
        count("sections", "En az iki section var", "main > section", 2),
        count("h2", "Bölümlerde en az iki h2 var", "section h2", 2),
      ],
    }),
    makeLesson(3, 2, {
      id: "w3-loadout-lists",
      title: "Loadout Listeleri",
      description: "Sırası önemli olan ve olmayan bilgileri farklı liste türleriyle ifade et.",
      fccCheckpoint: "FCC: Cat Photo App listeler bölümünü tamamladıktan sonra çöz.",
      outcomes: [
        "ul ile sırasız liste oluşturabilir.",
        "ol ile sıralı liste oluşturabilir.",
        "li elementini yalnızca liste parent'ları içinde kullanabilir.",
        "Bilginin sırasının önemli olup olmadığına göre liste türünü seçebilir.",
        "Listeleri section içeriğine doğal biçimde yerleştirebilir.",
      ],
      quickRecall: [
        ["Bir ekipman listesinin sırası önemli değilse?", "ul iyi bir seçimdir."],
        ["Bir görevin adımları sırayla yapılacaksa?", "ol kullanmak anlamı daha doğru taşır."],
        ["li tek başına kullanılmalı mı?", "Hayır; ul veya ol gibi bir liste elementi içinde bulunmalıdır."],
      ],
      practice: {
        title: "Practice · Ekipman Çantası",
        description: "Karakter ekipmanlarını ul içine yerleştir.",
        requirements: ["Bir ul oluştur.", "En az üç li ekle.", "Listeye heading ekle."],
      },
      challenge: {
        title: "Challenge · Görev Sırası",
        description: "Bir boss görevindeki adımları doğru liste türüyle ifade et.",
        requirements: ["Bir ol oluştur.", "En az üç adım yaz.", "İki liste türünü aynı sayfada kullan."],
      },
      miniBuild: {
        title: "Mini Build · Raid Hazırlığı",
        description: "Ekipmanlar ve görev adımları için iki farklı liste oluştur.",
        requirements: ["Bir ul.", "Bir ol.", "Toplam en az 6 li."],
      },
      starterCode: `<h1>Raid Hazırlığı</h1>\n<h2>Ekipmanlar</h2>\n<h2>Görev Sırası</h2>`,
      tests: [
        selector("ul", "Bir sırasız liste var", "ul"),
        selector("ol", "Bir sıralı liste var", "ol"),
        count("li", "Toplam en az altı liste öğesi var", "li", 6),
      ],
    }),
    makeLesson(3, 3, {
      id: "w3-tournament-memory-card",
      title: "Turnuva Anı Kartı",
      description: "Bir ekran görüntüsünü açıklamasıyla ilişkilendir; metindeki önemli bölümleri semantik olarak vurgula.",
      fccCheckpoint: "FCC: Cat Photo App figure/figcaption ve strong/em adımlarından sonra çöz.",
      outcomes: [
        "figure içinde medya içeriği gruplayabilir.",
        "figcaption ile figure içeriğine açıklama ekleyebilir.",
        "strong ile güçlü önem belirtebilir.",
        "em ile vurgu belirtebilir.",
        "Görsel, açıklama ve paragrafı tek bir anlamlı içerik bloğunda birleştirebilir.",
      ],
      quickRecall: [
        ["figcaption nerede kullanılmalıdır?", "İlişkili olduğu figure elementi içinde."],
        ["strong sadece kalın yazı demek mi?", "Hayır; güçlü önem anlamı taşır. Görsel stil CSS ile ayrıca değiştirilebilir."],
        ["em ne anlatır?", "Metinde vurgu veya ton değişikliği gibi semantik bir anlam taşır."],
      ],
      practice: {
        title: "Practice · Anıya Başlık Ver",
        description: "Turnuva görselini figure içine al ve açıklama ekle.",
        requirements: ["figure kullan.", "img + alt kullan.", "figcaption ekle."],
      },
      challenge: {
        title: "Challenge · Anlamlı Vurgu",
        description: "Paragraf içinde gerçekten önemli ve vurgulanması gereken bölümleri strong/em ile işaretle.",
        requirements: ["Bir strong kullan.", "Bir em kullan.", "Vurgular doğal cümle içinde olsun."],
      },
      miniBuild: {
        title: "Mini Build · Final Maçı Anısı",
        description: "Bir turnuva anısını görsel, caption ve kısa hikâyeyle sun.",
        requirements: ["figure + img + figcaption.", "Bir strong.", "Bir em."],
      },
      starterCode: `<h1>Turnuva Günlüğü</h1>\n<p>Final turu beklediğimizden çok daha çekişmeliydi.</p>`,
      tests: [
        selector("figure", "Bir figure yapısı var", "figure"),
        selector("caption", "Figure içinde figcaption var", "figure figcaption"),
        selector("figure-image", "Figure içinde erişilebilir görsel var", "figure img[alt]"),
        selector("strong", "Metinde strong kullanılmış", "strong"),
        selector("em", "Metinde em kullanılmış", "em"),
      ],
    }),
  ],
});

const week4 = makeWeek({
  order: 4,
  title: "Sıfırdan Sayfa Kur",
  theme: "Bilim Fuarı Portalı",
  summary:
    "Tam HTML belgesini bağımsız kurar; div, id, class ve temel HTML karakter/entegrasyon kavramlarını gerçek bir sayfa içinde kullanır.",
  weeklyBuild: "Starter code olmadan bir bilim fuarı proje sayfası oluşturmak.",
  fccStatus: "upcoming",
  fccSteps: { start: 53, end: 71, total: 137 },
  fccBlocks: [
    { title: "Build a Cat Photo App", type: "Workshop", scope: "Step 35–42" },
    { title: "Build a Recipe Page", type: "Lab", scope: "1 lab" },
    { title: "HTML Fundamentals", type: "Theory", scope: "4 step" },
    { title: "Build a Bookstore Page", type: "Workshop", scope: "Step 1–6" },
  ],
  outcomes: [
    "Sıfırdan geçerli bir HTML belgesi oluşturabilir.",
    "DOCTYPE, html, head, title, meta ve body görevlerini açıklayabilir.",
    "div elementini genel amaçlı container olarak kullanabilir.",
    "id ve class kavramlarını temel düzeyde ayırt edebilir.",
    "Bir gereksinim listesinden hareketle küçük bir sayfayı yardımsız kurabilir.",
  ],
  lessons: [
    makeLesson(4, 1, {
      id: "w4-full-document-from-zero",
      title: "Boş Dosyadan Başla",
      description: "Bu kez elinde yalnızca brief var. Belge iskeletini ve içeriği sıfırdan sen kuruyorsun.",
      fccCheckpoint: "FCC: Cat Photo App final document adımları + Recipe Page lab sonrası çöz.",
      outcomes: [
        "DOCTYPE ile başlayan belge yazabilir.",
        "lang, charset ve title bilgisini doğru yerde kullanabilir.",
        "body içeriğini heading ve paragraph ile kurabilir.",
        "Gereksinimleri tek tek kod çıktısına çevirebilir.",
        "Starter code olmadan belge oluşturma güveni kazanabilir.",
      ],
      quickRecall: [
        ["title body içinde mi olmalı?", "Hayır; title head içinde bulunur."],
        ["DOCTYPE bir HTML elementi midir?", "Hayır; belgenin HTML standardını kullandığını bildiren bir deklarasyondur."],
        ["Bir brief'i nasıl kodlarsın?", "Önce gereksinimleri yapı, içerik ve attribute olarak ayırmak faydalıdır."],
      ],
      practice: {
        title: "Practice · İskeleti Hatırla",
        description: "Boş editörde belge iskeletini hafızadan kur.",
        requirements: ["DOCTYPE.", "html/head/body.", "charset + title."],
      },
      challenge: {
        title: "Challenge · Brief'ten HTML'e",
        description: "Bir bilim projesi adı ve iki açıklama metnini doğru hiyerarşiyle ekle.",
        requirements: ["h1 kullan.", "En az iki p ekle.", "Belge yapısını bozmadan içerik oluştur."],
      },
      miniBuild: {
        title: "Mini Build · Manyetik Tren Deneyi",
        description: "Manyetik tren projesini tanıtan tam ve geçerli bir HTML sayfası oluştur.",
        requirements: ["Tam document shell.", "Bir h1.", "En az iki paragraf."],
      },
      starterCode: ``,
      tests: [doctype(), structure(), selector("charset", "UTF-8 tanımlı", 'meta[charset="UTF-8"], meta[charset="utf-8"]'), selector("h1", "Bir ana başlık var", "h1"), count("p", "En az iki paragraf var", "p", 2)],
    }),
    makeLesson(4, 2, {
      id: "w4-identity-cards",
      title: "Kimlik Kartları: div, id, class",
      description: "Sayfadaki tekrar eden ve benzersiz parçaları ayırt ederek markup'a kimlik kazandır.",
      fccCheckpoint: "FCC: HTML Fundamentals tamamlandıktan sonra çöz.",
      outcomes: [
        "div elementini genel amaçlı container olarak kullanabilir.",
        "class değerini tekrar eden öğelerde kullanabilir.",
        "id değerinin sayfa içinde benzersiz olması gerektiğini açıklayabilir.",
        "Aynı elementte class ve id bulunabileceğini anlayabilir.",
        "HTML entity kavramının neden gerekli olabileceğini temel düzeyde açıklayabilir.",
      ],
      quickRecall: [
        ["Üç proje kartı ortak bir gruba aitse id mi class mı?", "Ortak özellik için class daha uygundur."],
        ["Bir sayfada aynı id'yi birçok yerde kullanmalı mıyız?", "Hayır. id sayfa içinde benzersiz bir öğeyi tanımlamak için kullanılmalıdır."],
        ["div bize içeriğin anlamını söyler mi?", "Hayır. div genel amaçlı bir container'dır."],
      ],
      practice: {
        title: "Practice · Kartları Grupla",
        description: "Üç bilim projesini ortak class kullanan div kartlarına dönüştür.",
        requirements: ["En az üç div.", "Hepsinde ortak class.", "Her birinde farklı id."],
      },
      challenge: {
        title: "Challenge · Benzersiz mi Ortak mı?",
        description: "Verilen isimlerden hangisinin id, hangisinin class olması gerektiğine kendin karar ver.",
        requirements: ["Tekrarlanan değer class olsun.", "Benzersiz değerler id olsun.", "Class ve id anlamlı isimlendirilsin."],
      },
      miniBuild: {
        title: "Mini Build · Bilim Fuarı Kartları",
        description: "En az üç proje kartından oluşan küçük bir fuar listesi oluştur.",
        requirements: ["3 .project-card.", "Her kartta benzersiz id.", "Her kartta heading ve p."],
      },
      starterCode: `<h1>Bilim Fuarı 2026</h1>\n<main>\n</main>`,
      tests: [
        count("cards", "En az üç proje kartı var", ".project-card", 3),
        count("ids", "En az üç benzersiz kart id'si tanımlanmış", ".project-card[id]", 3),
        count("card-heading", "Kartların içinde başlıklar var", ".project-card h2, .project-card h3", 3),
      ],
    }),
    makeLesson(4, 3, {
      id: "w4-robot-parts-guide",
      title: "Robot Parçaları Rehberi",
      description: "İlk bağımsız build: sana hangi etiketi kullanacağını söylemeden gereksinimleri çalışan sayfaya dönüştür.",
      fccCheckpoint: "FCC: Recipe Page + HTML Fundamentals + Bookstore başlangıcı sonrası çöz.",
      outcomes: [
        "Tam belge iskeleti ile içerik yapısını birlikte kurabilir.",
        "Görsel, liste ve metni tek bir konu altında düzenleyebilir.",
        "class/id bilgisini içerik gruplarında kullanabilir.",
        "Bir ürün veya parça rehberini HTML ile modelleyebilir.",
        "Test gereksinimlerini okuyup eksik markup'ı kendi başına tamamlayabilir.",
      ],
      quickRecall: [
        ["Starter code yoksa ilk yazacağın şey ne olabilir?", "DOCTYPE ve temel belge iskeleti iyi bir başlangıçtır."],
        ["Tekrarlanan parça kartlarına ne verilebilir?", "Ortak bir class."],
        ["Parça özelliklerini hangi yapı anlatabilir?", "Sırası önemli değilse ul/li gibi bir liste."],
      ],
      practice: {
        title: "Practice · Gereksinimi Parçala",
        description: "Brief'i belge, içerik, medya ve tekrar eden kartlar olarak dört parçaya ayır.",
        requirements: ["Belge iskeletini kur.", "Ana başlık ekle.", "Kart alanını planla."],
      },
      challenge: {
        title: "Challenge · Parça Kartları",
        description: "Motor, sensör ve batarya için üç bağımsız kart oluştur.",
        requirements: ["Ortak class kullan.", "Her kartta başlık ve özellik listesi olsun.", "En az bir kartta görsel kullan."],
      },
      miniBuild: {
        title: "Mini Build · Robot Parçaları Rehberi",
        description: "Tam belge içinde üç robot parçasını açıklayan bağımsız mini rehber üret.",
        requirements: ["DOCTYPE + structure.", "3 kart.", "En az 1 img + alt.", "En az 1 ul."],
      },
      starterCode: ``,
      tests: [
        doctype(),
        structure(),
        count("cards", "Üç parça kartı var", ".part-card", 3),
        selector("image", "En az bir erişilebilir parça görseli var", "img[alt]"),
        selector("list", "En az bir özellik listesi var", "ul li"),
      ],
    }),
  ],
});

const week5 = makeWeek({
  order: 5,
  title: "Gerçek Sayfa Mantığı",
  theme: "Robot Yarışması Etkinlik Sitesi",
  summary:
    "Tekrarlanabilir kartlar, button kullanımı ve SEO metadata ile HTML'in yalnızca etiketlerden değil, gerçek bir sayfa planından oluştuğunu görür.",
  weeklyBuild: "Robot yarışması için çok bölümlü, kartlı ve arama motorlarına açıklama veren etkinlik sayfası kurmak.",
  fccStatus: "upcoming",
  fccSteps: { start: 72, end: 87, total: 137 },
  fccBlocks: [
    { title: "Build a Bookstore Page", type: "Workshop", scope: "Step 7–19" },
    { title: "Understanding How HTML Affects SEO", type: "Theory", scope: "2 step" },
    { title: "Build a Travel Agency Page", type: "Lab", scope: "1 lab" },
  ],
  outcomes: [
    "Tekrarlanabilir içerik kartlarını class ile gruplayabilir.",
    "Benzersiz öğeleri id ile tanımlayabilir.",
    "button elementini eylem amaçlı doğru yerde kullanabilir.",
    "meta description ve temel sosyal metadata amacını açıklayabilir.",
    "Bir brief'ten çok bölümlü gerçek bir HTML sayfası oluşturabilir.",
  ],
  lessons: [
    makeLesson(5, 1, {
      id: "w5-tournament-card-system",
      title: "Turnuva Kart Sistemi",
      description: "Takımları tekrar eden kart yapısında modelle; ortak yapıyla benzersiz kimliği birbirinden ayır.",
      fccCheckpoint: "FCC: Bookstore Page kart ve id/class adımlarından sonra çöz.",
      outcomes: [
        "Bir kart sisteminde ortak class kullanabilir.",
        "Her kart için benzersiz id üretebilir.",
        "Kart içinde heading ve açıklamayı düzenleyebilir.",
        "Aynı yapıyı tekrar ederken markup tutarlılığını koruyabilir.",
        "Container ve içerik elementlerinin rollerini ayırabilir.",
      ],
      quickRecall: [
        ["Takım kartlarının hepsi aynı tipe aitse?", "Ortak bir class kullanabiliriz."],
        ["Takım numarası benzersizse?", "id için uygun bir adaydır."],
        ["Kartları sırf görünüş için mi kuruyoruz?", "Hayır. HTML önce yapıyı ve içeriği modellemelidir; görünüş daha sonra CSS ile gelir."],
      ],
      practice: {
        title: "Practice · İlk İki Takım",
        description: "İki takım kartını aynı class ile oluştur.",
        requirements: [".team-card class.", "Farklı id'ler.", "Her kartta h2 ve p."],
      },
      challenge: {
        title: "Challenge · Kart Sistemi",
        description: "Üçüncü ve dördüncü kartı yardım almadan ekle.",
        requirements: ["Toplam dört kart.", "Tüm kartlarda aynı class.", "Her id benzersiz olsun."],
      },
      miniBuild: {
        title: "Mini Build · Katılımcı Duvarı",
        description: "Dört robot takımını tanıtan katılımcı alanı oluştur.",
        requirements: ["4 .team-card.", "4 id.", "Her kartta başlık ve açıklama."],
      },
      starterCode: `<h1>RoboCup Gençler Ligi</h1>\n<section id="teams">\n</section>`,
      tests: [
        count("cards", "Dört takım kartı var", ".team-card", 4),
        count("card-ids", "Dört takım kartında id var", ".team-card[id]", 4),
        count("headings", "Her kart için yeterli takım başlığı var", ".team-card h2, .team-card h3", 4),
      ],
    }),
    makeLesson(5, 2, {
      id: "w5-action-buttons",
      title: "Eylem Noktaları",
      description: "Bir bağlantı ile bir eylem kontrolünün aynı şey olmadığını fark et; button elementini doğru amaçta kullan.",
      fccCheckpoint: "FCC: Bookstore Page button adımlarından sonra çöz.",
      outcomes: [
        "button elementinin kullanıcı eylemi için kullanıldığını açıklayabilir.",
        "button ile a elementi arasındaki temel kullanım farkını ayırt edebilir.",
        "Kartların içine tutarlı button öğeleri ekleyebilir.",
        "Buton metnini eylemi açıkça ifade edecek şekilde yazabilir.",
        "Bir eylem alanını heading ve açıklama ile bağlam içinde sunabilir.",
      ],
      quickRecall: [
        ["Başka bir sayfaya gitmek için button mı a mı?", "Genellikle navigasyon için a; sayfa içinde bir eylem tetiklemek için button daha uygundur."],
        ["'Tıkla' iyi bir button metni mi?", "Bağlama göre yetersiz olabilir. 'Takımı incele' gibi eylemi açıklayan metin daha nettir."],
        ["Button çalışması için şu an JavaScript şart mı?", "Bu derste hayır; önce doğru HTML elementini seçmeyi öğreniyoruz."],
      ],
      practice: {
        title: "Practice · Kontrol Merkezi",
        description: "Takım kartlarına anlaşılır eylem butonları ekle.",
        requirements: ["En az üç button.", "Her buton metni eylemi anlatsın.", "Button kart içinde bulunsun."],
      },
      challenge: {
        title: "Challenge · Link mi Button mı?",
        description: "Verilen dört kullanıcı niyetinde doğru element tipini seç.",
        requirements: ["Navigasyon link olsun.", "Eylem button olsun.", "Metinler kendi başına anlamlı olsun."],
      },
      miniBuild: {
        title: "Mini Build · Hakem Paneli Mockup",
        description: "Sadece HTML kullanarak takım kartları ve eylem butonlarından oluşan statik hakem paneli oluştur.",
        requirements: ["3 kart.", "Her kartta button.", "En az bir dış bağlantı."],
      },
      starterCode: `<h1>Hakem Paneli</h1>\n<div class="team-card">\n  <h2>Takım Atlas</h2>\n  <p>Çizgi izleyen robot kategorisi.</p>\n</div>`,
      tests: [
        count("buttons", "En az üç eylem butonu var", "button", 3),
        selector("external-link", "En az bir bağlantı var", "a[href]"),
      ],
    }),
    makeLesson(5, 3, {
      id: "w5-search-engine-clues",
      title: "Arama Motoruna İpucu",
      description: "Sayfayı yalnızca kullanıcı için değil, arama motorları ve paylaşım önizlemeleri için de açıklamayı dene.",
      fccCheckpoint: "FCC: Understanding How HTML Affects SEO + Travel Agency Page sonrası çöz.",
      outcomes: [
        "meta description'ın amacını açıklayabilir.",
        "description meta elementini head içine ekleyebilir.",
        "Open Graph metadata kavramını temel düzeyde tanıyabilir.",
        "Sayfa başlığı ile açıklamasını içerikle tutarlı yazabilir.",
        "SEO metadata ile görünen body içeriğinin farklı görevleri olduğunu açıklayabilir.",
      ],
      quickRecall: [
        ["Meta description ziyaretçinin sayfada gördüğü paragraf mı?", "Hayır. head içinde yer alan metadata'dır; arama motorları gibi sistemler tarafından kullanılabilir."],
        ["description içeriği ne anlatmalı?", "Sayfanın konusunu kısa ve gerçekçi biçimde özetlemeli."],
        ["Metadata neden head içindedir?", "Belge hakkında bilgi verir; ana görünen içerik değildir."],
      ],
      practice: {
        title: "Practice · Etkinliği Tanımla",
        description: "Robot yarışması sayfasına title ve meta description ekle.",
        requirements: ["title head içinde.", "meta name=description.", "Anlamlı content değeri."],
      },
      challenge: {
        title: "Challenge · Paylaşım Başlığı",
        description: "Temel bir og:title metadata satırı ekleyerek sosyal paylaşım metadata kavramını dene.",
        requirements: ["meta property=og:title.", "content boş olmasın.", "Body içeriğini değiştirmeden metadata ekle."],
      },
      miniBuild: {
        title: "Mini Build · RoboCup Etkinlik Sayfası",
        description: "Metadata, ana içerik, kartlar, linkler ve figure içeren etkinlik tanıtım sayfası oluştur.",
        requirements: ["Tam document shell.", "meta description.", "og:title.", "En az 2 section.", "Bir figure."],
      },
      starterCode: `<!DOCTYPE html>\n<html lang="tr">\n<head>\n  <meta charset="UTF-8">\n  <title>RoboCup Gençler Ligi</title>\n</head>\n<body>\n  <h1>RoboCup Gençler Ligi</h1>\n</body>\n</html>`,
      tests: [
        selector("description", "Meta description tanımlı", 'meta[name="description"][content]'),
        selector("og-title", "Open Graph başlığı tanımlı", 'meta[property="og:title"][content]'),
        count("sections", "En az iki içerik bölümü var", "section", 2),
        selector("figure", "Etkinlik için bir figure alanı var", "figure"),
      ],
    }),
  ],
});

const week6 = makeWeek({
  order: 6,
  title: "Tarayıcıda Medya",
  theme: "Uzay Sinyalleri İstasyonu",
  summary:
    "Audio ve video elementleriyle tarayıcıya gerçek medya yerleştirir; boolean attribute'ları ve kullanıcı kontrollerini deneyimler.",
  weeklyBuild: "Ses kayıtları ve rover video günlüğü içeren bir uzay sinyalleri istasyonu oluşturmak.",
  fccStatus: "upcoming",
  fccSteps: { start: 88, end: 103, total: 137 },
  fccBlocks: [
    { title: "Working with Audio and Video Elements", type: "Theory", scope: "1 step" },
    { title: "Build an HTML Music Player", type: "Workshop", scope: "9 step" },
    { title: "Build an HTML Video Player", type: "Workshop", scope: "Step 1–6" },
  ],
  outcomes: [
    "audio ve video elementlerinin rollerini ayırt edebilir.",
    "src ile medya kaynağı tanımlayabilir.",
    "controls, loop ve muted boolean attribute'larını kullanabilir.",
    "Birden fazla medya öğesini anlamlı bir içerik yapısında sunabilir.",
    "Medya elementlerinin kullanıcı deneyimine etkisini temel düzeyde değerlendirebilir.",
  ],
  lessons: [
    makeLesson(6, 1, {
      id: "w6-space-signals-audio",
      title: "Uzay Sinyalleri",
      description: "Kontrol merkezine ulaşan ses kayıtlarını tarayıcı içinde oynatılabilir hale getir.",
      fccCheckpoint: "FCC: Working with Audio and Video Elements + Music Player başlangıcı sonrası çöz.",
      outcomes: [
        "audio elementini sayfaya ekleyebilir.",
        "audio elementinde src kullanabilir.",
        "controls boolean attribute'unu ekleyebilir.",
        "Ses kaydına metinsel bağlam sağlayabilir.",
        "Birden fazla audio elementini bölümleyebilir.",
      ],
      quickRecall: [
        ["Kullanıcının play/pause kontrollerini görmesi için?", "audio elementine controls attribute'u eklenebilir."],
        ["controls='true' yazmak zorunlu mu?", "Hayır. controls bir boolean attribute'dur; varlığı özelliği etkinleştirmeye yeter."],
        ["Audio tek başına anlamlı mı?", "Teknik olarak oynatılabilir; fakat heading/açıklama ile bağlam vermek kullanıcı için çok daha iyidir."],
      ],
      practice: {
        title: "Practice · İlk Sinyal",
        description: "İlk ses kaydını controls ile oynatılabilir hale getir.",
        requirements: ["audio kullan.", "src ekle.", "controls ekle."],
      },
      challenge: {
        title: "Challenge · Üç Frekans",
        description: "Üç ayrı sinyal kaydı için üç audio player oluştur.",
        requirements: ["3 audio.", "Her birinde controls.", "Her kaydın bir başlığı olsun."],
      },
      miniBuild: {
        title: "Mini Build · Sinyal Arşivi",
        description: "Üç sinyali açıklamalarıyla birlikte tek arşiv sayfasında topla.",
        requirements: ["3 audio[src][controls].", "3 açıklama.", "Bir ana h1."],
      },
      starterCode: `<h1>Deep Space Sinyal Arşivi</h1>\n<p>Kayıtlar simülasyon amaçlıdır.</p>`,
      tests: [count("audio", "En az üç audio player var", "audio[src][controls]", 3), selector("h1", "Arşivin ana başlığı var", "h1")],
    }),
    makeLesson(6, 2, {
      id: "w6-loop-lab",
      title: "Loop Laboratuvarı",
      description: "Boolean attribute'ların davranışı nasıl değiştirdiğini ses oynatıcısı üzerinde gözlemle.",
      fccCheckpoint: "FCC: HTML Music Player loop ve controls adımlarından sonra çöz.",
      outcomes: [
        "loop attribute'unun medya oynatımına etkisini açıklayabilir.",
        "Boolean attribute'ları değer yazmadan kullanabilir.",
        "Farklı audio player'lara farklı davranışlar verebilir.",
        "Attribute değişikliğinin önizlemeye etkisini gözlemleyebilir.",
        "Kullanıcı açısından otomatik tekrarın ne zaman uygun olabileceğini tartışabilir.",
      ],
      quickRecall: [
        ["loop ne yapar?", "Medya sona geldiğinde yeniden başlamasını sağlar."],
        ["Her ses kaydını loop yapmak iyi fikir mi?", "Her zaman değil. Kullanıcı deneyimine göre karar verilmelidir."],
        ["Boolean attribute nedir?", "Varlığıyla etkinleşen, çoğunlukla true/false davranışı temsil eden attribute türüdür."],
      ],
      practice: {
        title: "Practice · Tekrar Eden Beacon",
        description: "Beacon sinyalini loop ile tekrar edecek şekilde ayarla.",
        requirements: ["audio src.", "controls.", "loop."],
      },
      challenge: {
        title: "Challenge · Farklı Davranışlar",
        description: "İki player'dan yalnızca beacon kaydı loop etsin.",
        requirements: ["2 audio.", "İkisinde controls.", "Yalnızca en az birinde loop."],
      },
      miniBuild: {
        title: "Mini Build · Acil Durum Beaconı",
        description: "Acil durum sinyali ve normal günlük kaydını iki farklı player davranışıyla sun.",
        requirements: ["2 audio.", "Bir audio loop.", "Her ikisi controls."],
      },
      starterCode: `<h1>Sinyal Laboratuvarı</h1>\n<audio src="/media/beacon.mp3" controls></audio>\n<audio src="/media/log.mp3" controls></audio>`,
      tests: [count("audio", "İki audio player var", "audio[controls]", 2), selector("loop", "En az bir audio loop ediyor", "audio[loop]")],
    }),
    makeLesson(6, 3, {
      id: "w6-rover-video-log",
      title: "Rover Video Günlüğü",
      description: "Roverın yüzey kaydını video elementiyle sun ve player davranışını attribute'larla kontrol et.",
      fccCheckpoint: "FCC: HTML Video Player Step 1–6 sonrası çöz.",
      outcomes: [
        "video elementini HTML sayfasına ekleyebilir.",
        "video için src ve controls kullanabilir.",
        "muted ve loop boolean attribute'larını kullanabilir.",
        "Video boyutunu width attribute'u ile temel düzeyde kontrol edebilir.",
        "Video içeriğini heading ve açıklama ile bağlamlandırabilir.",
      ],
      quickRecall: [
        ["Video kontrollerini göstermek için?", "controls attribute'u."],
        ["muted ne yapar?", "Videonun sesini başlangıçta sessize alır."],
        ["HTML width ile CSS width aynı kavram mı?", "İkisi de boyutu etkileyebilir fakat farklı katmanlarda çalışırlar; CSS bölümünde bunu daha ayrıntılı ele alacağız."],
      ],
      practice: {
        title: "Practice · İlk Yüzey Kaydı",
        description: "Video kaydına src, controls ve width ekle.",
        requirements: ["video kullan.", "src.", "controls.", "width."],
      },
      challenge: {
        title: "Challenge · Sessiz Döngü",
        description: "Tanıtım videosunu sessiz ve döngü halinde çalışacak şekilde işaretle.",
        requirements: ["muted.", "loop.", "controls."],
      },
      miniBuild: {
        title: "Mini Build · Rover Günlüğü",
        description: "Başlık, açıklama ve kontrol edilebilir bir rover videosundan oluşan günlük sayfası oluştur.",
        requirements: ["video[src][controls].", "muted.", "loop.", "width."],
      },
      starterCode: `<h1>ARES-9 Video Günlüğü</h1>\n<p>Sol 184: krater kenarı taraması.</p>`,
      tests: [
        selector("video", "Video kaydı var", "video[src][controls]"),
        selector("muted", "Video muted olarak işaretlenmiş", "video[muted]"),
        selector("loop", "Video loop olarak işaretlenmiş", "video[loop]"),
        selector("width", "Video için width tanımlı", "video[width]"),
      ],
    }),
  ],
});

const week7 = makeWeek({
  order: 7,
  title: "Medya Dayanıklılığı ve SVG",
  theme: "Mission Control Dashboard",
  summary:
    "source/type/poster ile medya seçeneklerini geliştirir; raster ve vektör görsel farkını öğrenip basit SVG yapısını HTML içinde kullanır.",
  weeklyBuild: "Çoklu medya kaynağı ve özgün SVG görev rozeti içeren mission control kartı oluşturmak.",
  fccStatus: "upcoming",
  fccSteps: { start: 104, end: 120, total: 137 },
  fccBlocks: [
    { title: "Build an HTML Video Player", type: "Workshop", scope: "Step 7–13" },
    { title: "Build an HTML Audio and Video Player", type: "Lab", scope: "1 lab" },
    { title: "Working with Images and SVGs", type: "Theory", scope: "3 step" },
    { title: "Build a Heart Icon", type: "Workshop", scope: "6 step" },
  ],
  outcomes: [
    "source elementiyle alternatif medya kaynakları tanımlayabilir.",
    "MIME type bilgisinin medya seçimindeki rolünü temel düzeyde açıklayabilir.",
    "poster attribute'u ile video önizleme görseli tanımlayabilir.",
    "Raster görseller ile SVG arasındaki temel farkı açıklayabilir.",
    "Basit bir inline SVG ikonunun temel elementlerini okuyabilir ve düzenleyebilir.",
  ],
  lessons: [
    makeLesson(7, 1, {
      id: "w7-multi-format-video",
      title: "Çoklu Format Video",
      description: "Tek src yerine source elementleriyle daha dayanıklı bir video yapısı kur.",
      fccCheckpoint: "FCC: HTML Video Player source/type/poster adımları sonrası çöz.",
      outcomes: [
        "source elementini video içinde kullanabilir.",
        "Birden fazla source ile alternatif medya kaynağı tanımlayabilir.",
        "type attribute'unu source üzerinde kullanabilir.",
        "poster attribute'unu video üzerinde kullanabilir.",
        "Tarayıcının uygun source'u seçebilmesi fikrini açıklayabilir.",
      ],
      quickRecall: [
        ["source nerede bulunabilir?", "Bu senaryoda video elementinin child'ı olarak."],
        ["type ne anlatır?", "Kaynağın MIME türü hakkında tarayıcıya bilgi verir."],
        ["poster ne zaman görünür?", "Video başlamadan önce veya video yüklenirken önizleme görseli olarak kullanılabilir."],
      ],
      practice: {
        title: "Practice · İkinci Kaynak",
        description: "Video player'a iki farklı source ve type ekle.",
        requirements: ["video.", "2 source.", "Her source'da type."],
      },
      challenge: {
        title: "Challenge · Poster Ekranı",
        description: "Video başlamadan önce görev görseli gösterilecek şekilde poster ekle.",
        requirements: ["video poster.", "controls.", "İki source korunmalı."],
      },
      miniBuild: {
        title: "Mini Build · Görev Kaydı Playerı",
        description: "Poster görseli ve iki alternatif kaynak içeren dayanıklı bir görev videosu oluştur.",
        requirements: ["video[poster][controls].", "2 source[src][type]."],
      },
      starterCode: `<h1>Mission Control Kaydı</h1>\n<video controls>\n</video>`,
      tests: [selector("poster", "Video poster görseline sahip", "video[poster][controls]"), count("sources", "En az iki medya kaynağı var", "video source[src][type]", 2)],
    }),
    makeLesson(7, 2, {
      id: "w7-pixels-vectors",
      title: "Piksel mi Vektör mü?",
      description: "Görsel türünü kullanım amacına göre düşün: fotoğrafta raster, ölçeklenebilir ikonlarda SVG neden mantıklı olabilir?",
      fccCheckpoint: "FCC: Working with Images and SVGs tamamlandıktan sonra çöz.",
      outcomes: [
        "Raster görsellerin piksel tabanlı olduğunu açıklayabilir.",
        "SVG'nin vektör tabanlı ve ölçeklenebilir olduğunu açıklayabilir.",
        "Fotoğraf ve ikon için uygun görsel türünü temel düzeyde seçebilir.",
        "inline svg elementini HTML içinde tanıyabilir.",
        "svg üzerinde viewBox kavramının varlığını ve ölçekleme ilişkisini temel düzeyde tanıyabilir.",
      ],
      quickRecall: [
        ["Bir fotoğrafı SVG yapmak genellikle mantıklı mı?", "Genellikle hayır; fotoğraflar raster formatlara daha uygundur."],
        ["Bir ikon farklı boyutlarda keskin kalmalıysa?", "SVG çoğu durumda iyi bir seçimdir."],
        ["SVG HTML içine yazılabilir mi?", "Evet, inline SVG markup doğrudan HTML içine yerleştirilebilir."],
      ],
      practice: {
        title: "Practice · İkon Kabı",
        description: "Sayfaya viewBox içeren basit bir svg ekle.",
        requirements: ["svg elementi.", "viewBox attribute'u.", "İçinde en az bir shape elementi."],
      },
      challenge: {
        title: "Challenge · Fotoğraf + İkon",
        description: "Rover fotoğrafı için img, görev rozeti için svg kullan.",
        requirements: ["img + alt.", "svg + viewBox.", "İki görsel türünü aynı içerikte kullan."],
      },
      miniBuild: {
        title: "Mini Build · Görev Kimlik Kartı",
        description: "Bir raster görev fotoğrafını ve vektör rozetini aynı kartta sun.",
        requirements: ["img[alt].", "svg[viewBox].", "Bir heading ve p."],
      },
      starterCode: `<h1>ARES-9 Görev Kimliği</h1>\n<p>Görev kodu: MC-209</p>`,
      tests: [selector("image", "Raster görsel erişilebilir biçimde eklenmiş", "img[alt]"), selector("svg", "Inline SVG ve viewBox var", "svg[viewBox]")],
    }),
    makeLesson(7, 3, {
      id: "w7-mission-control-badge",
      title: "Mission Control Rozeti",
      description: "SVG'yi çizim programı gibi ezberleme; markup olarak okuyup küçük bir göreve göre düzenle.",
      fccCheckpoint: "FCC: Build a Heart Icon + Audio and Video Player lab sonrası çöz.",
      outcomes: [
        "svg içinde path, circle veya rect gibi shape elementlerini tanıyabilir.",
        "SVG markup'ındaki attribute'ların çizimi değiştirdiğini gözlemleyebilir.",
        "Basit bir SVG'yi başka HTML içeriğiyle birlikte kullanabilir.",
        "Medya ve ikon içeriğini tek bir figure veya section içinde gruplayabilir.",
        "Kopyalanan SVG'yi körlemesine kullanmak yerine temel yapısını okuyabilir.",
      ],
      quickRecall: [
        ["SVG'nin içindeki path bir HTML paragrafı mı?", "Hayır. SVG namespace'i içinde vektör şekli tarif eden bir elementtir."],
        ["SVG'yi bu aşamada elle profesyonel çizmek zorunda mıyız?", "Hayır. Ama temel markup'ın ne yaptığını okuyabilmeliyiz."],
        ["İkonu sayfada başlıksız bırakmak zorunda mıyız?", "Hayır. Onu anlamlı metin ve içerikle birlikte sunabiliriz."],
      ],
      practice: {
        title: "Practice · Rozeti Oku",
        description: "Verilen SVG'de viewBox ve shape elementlerini bul.",
        requirements: ["svg.", "viewBox.", "circle/rect/path öğelerinden biri."],
      },
      challenge: {
        title: "Challenge · Görev Rozeti",
        description: "Rozeti kendi mission code'unla birlikte bir section içine yerleştir.",
        requirements: ["section.", "svg.", "heading + açıklama."],
      },
      miniBuild: {
        title: "Mini Build · Mission Control Kartı",
        description: "SVG rozet, görev videosu ve kısa durum metnini tek kontrol kartında birleştir.",
        requirements: ["svg[viewBox].", "video veya audio.", "section.", "heading."],
      },
      starterCode: `<section>\n  <h1>Mission Control</h1>\n  <p>ARES-9 bağlantısı aktif.</p>\n</section>`,
      tests: [selector("section", "Görev kartı bir section içinde", "section"), selector("svg", "Görev rozeti SVG olarak eklenmiş", "svg[viewBox]"), selector("media", "Kartta bir medya elementi var", "video, audio")],
    }),
  ],
});

const week8 = makeWeek({
  order: 8,
  title: "Bağlantılar, iframe ve Final",
  theme: "Kendi Teknoloji Kulübün",
  summary:
    "iframe, relative/absolute paths ve target davranışlarını birleştirir; ardından Basic HTML bilgisini boş editörden bağımsız final projede kullanır.",
  weeklyBuild: "Basic HTML'in tamamını kullanan kişisel teknoloji kulübü portalı oluşturmak.",
  fccStatus: "upcoming",
  fccSteps: { start: 121, end: 137, total: 137 },
  fccBlocks: [
    { title: "Working with the iframe Element", type: "Theory", scope: "2 step" },
    { title: "Build a Video Display Using iframe", type: "Workshop", scope: "8 step" },
    { title: "Build a Video Compilation Page", type: "Lab", scope: "1 lab" },
    { title: "Working with Links", type: "Theory", scope: "4 step" },
    { title: "Basic HTML Review", type: "Review", scope: "1 review" },
    { title: "Basic HTML Quiz", type: "Quiz", scope: "1 quiz" },
  ],
  outcomes: [
    "iframe ile harici içeriği sayfaya gömebilir.",
    "Absolute ve relative path arasındaki farkı açıklayabilir.",
    "./ ve ../ path ifadelerini okuyup kullanabilir.",
    "target değerlerinin bağlantı davranışını nasıl değiştirdiğini açıklayabilir.",
    "Basic HTML konularını boş editörde tek bir bağımsız projede birleştirebilir.",
  ],
  lessons: [
    makeLesson(8, 1, {
      id: "w8-live-mission-screen",
      title: "Canlı Görev Ekranı",
      description: "Başka bir kaynaktaki içeriği iframe aracılığıyla kontrol paneline göm.",
      fccCheckpoint: "FCC: iframe theory + Video Display Using iframe workshop sonrası çöz.",
      outcomes: [
        "iframe elementinin gömülü içerik için kullanıldığını açıklayabilir.",
        "iframe üzerinde src kullanabilir.",
        "iframe'e title vererek içeriğini tanımlayabilir.",
        "width ve height attribute'larıyla temel boyut tanımlayabilir.",
        "Gömülü içerik ile normal bağlantı arasındaki farkı açıklayabilir.",
      ],
      quickRecall: [
        ["iframe link gibi kullanıcıyı başka sayfaya mı götürür?", "Hayır; başka bir kaynağın içeriğini mevcut sayfanın içine gömer."],
        ["iframe title neden değerlidir?", "Gömülen içeriğin ne olduğunu yardımcı teknolojilere açıklamaya yardımcı olur."],
        ["Her site iframe içinde çalışır mı?", "Hayır. Dış site güvenlik politikaları gömülmeyi engelleyebilir."],
      ],
      practice: {
        title: "Practice · Görev Yayını",
        description: "Bir iframe'i src ve title ile oluştur.",
        requirements: ["iframe.", "src.", "title."],
      },
      challenge: {
        title: "Challenge · İki Ekran",
        description: "İki farklı gömülü kaynak için iki iframe alanı planla.",
        requirements: ["2 iframe.", "İkisinde title.", "Her birinin heading'i olsun."],
      },
      miniBuild: {
        title: "Mini Build · Mission Feed",
        description: "Kontrol merkezindeki canlı yayın ve görev videosu için iki gömülü ekran oluştur.",
        requirements: ["2 iframe[src][title].", "Her ekranı section ile grupla."],
      },
      starterCode: `<h1>Mission Feed</h1>\n<p>Harici görev ekranlarını aşağıya yerleştir.</p>`,
      tests: [count("iframes", "En az iki gömülü ekran var", "iframe[src][title]", 2), count("sections", "Ekranlar bölümlere ayrılmış", "section", 2)],
    }),
    makeLesson(8, 2, {
      id: "w8-path-escape-room",
      title: "Dosya Yolları Kaçış Odası",
      description: "Absolute URL, relative path, ./ ve ../ ipuçlarını doğru kullanarak bağlantı labirentinden çık.",
      fccCheckpoint: "FCC: Working with Links tamamlandıktan sonra çöz.",
      outcomes: [
        "Absolute URL'yi relative path'ten ayırabilir.",
        "./ ifadesini mevcut klasör bağlamında okuyabilir.",
        "../ ifadesini bir üst klasöre çıkma olarak okuyabilir.",
        "target=_self ve target=_blank davranışlarını ayırt edebilir.",
        "Proje içi ve dış bağlantılar için uygun path türünü seçebilir.",
      ],
      quickRecall: [
        ["https://example.com/docs ne tür bir yol?", "Tam bir absolute URL örneğidir."],
        ["../images/logo.svg ne anlatır?", "Mevcut klasörün bir üstüne çıkıp images klasöründeki dosyaya gitmeyi."],
        ["./about.html ne anlatır?", "Mevcut klasördeki about.html dosyasını."],
      ],
      practice: {
        title: "Practice · Üç Kapı",
        description: "Bir dış site, bir aynı-klasör sayfası ve bir üst-klasör dosyası için üç bağlantı yaz.",
        requirements: ["Absolute href.", "./ kullanan href.", "../ kullanan href."],
      },
      challenge: {
        title: "Challenge · Hedef Davranışı",
        description: "Dış bağlantıyı yeni sekmeye, proje içi bağlantıyı aynı sekmeye ayarla.",
        requirements: ["_blank.", "_self.", "Href tiplerini doğru eşleştir."],
      },
      miniBuild: {
        title: "Mini Build · Kulüp Navigasyonu",
        description: "Kulübün ana sayfa, projeler, arşiv ve dış kaynak bağlantılarını içeren mini navigasyon oluştur.",
        requirements: ["En az 4 a[href].", "Bir ./ yolu.", "Bir ../ yolu.", "Bir https URL."],
      },
      starterCode: `<h1>Kulüp Navigasyonu</h1>\n<nav>\n</nav>`,
      tests: [
        count("links", "En az dört bağlantı var", "a[href]", 4),
        selector("dot", "En az bir ./ relative path var", 'a[href^="./"]'),
        selector("dotdot", "En az bir ../ relative path var", 'a[href^="../"]'),
        selector("absolute", "En az bir absolute https bağlantısı var", 'a[href^="https://"]'),
      ],
    }),
    makeLesson(8, 3, {
      id: "basic-html-final-tech-club",
      title: "Final Build · Kendi Teknoloji Kulübün",
      description: "Basic HTML finali. Starter code yok; hangi etiketi kullanacağını söyleyen adım adım yardım yok. Yalnızca ürün gereksinimleri var.",
      fccCheckpoint: "FCC: Basic HTML Review + Basic HTML Quiz tamamlandıktan sonra çöz.",
      outcomes: [
        "Tam ve geçerli bir HTML belgesini bağımsız kurabilir.",
        "Metin, listeler, linkler, görseller ve bölümleri anlamlı bir hiyerarşide birleştirebilir.",
        "class/id, metadata ve medya elementlerini gerçek bir sayfa senaryosunda kullanabilir.",
        "SVG, iframe ve relative path gibi ileri Basic HTML konularını uygun yerde kullanabilir.",
        "Bir ürün brief'ini adım adım talimat olmadan çalışan HTML çıktısına dönüştürebilir.",
      ],
      quickRecall: [
        ["Finalde ilk iş nedir?", "Brief'i okumak ve gereksinimleri belge yapısı, içerik, medya ve bağlantılar olarak gruplamak."],
        ["Testin söylediği etiketi körlemesine mi eklemelisin?", "Hayır. Önce sayfanın anlamlı yapısını kur, testleri eksik gereksinimleri kontrol etmek için kullan."],
        ["CSS gerekiyor mu?", "Hayır. Bu final yalnızca Basic HTML bilgisini ölçüyor."],
      ],
      practice: {
        title: "Plan · Kod Yazmadan Önce",
        description: "Önce kulübünün temasını seç ve sayfanın bölümlerini kağıt üzerinde veya yorum satırlarıyla planla.",
        requirements: ["Kulüp adı seç.", "En az üç içerik bölümü planla.", "Hangi medya öğesini nerede kullanacağını belirle."],
      },
      challenge: {
        title: "Build · Portalı Kur",
        description: "Belgeyi boş editörden kur ve testleri ancak anlamlı bir ilk sürüm çıktıktan sonra çalıştır.",
        requirements: ["Tam document shell.", "Metadata.", "Bölümlü içerik.", "Görsel/link/liste.", "Medya + SVG + iframe."],
      },
      miniBuild: {
        title: "Final · Teknoloji Kulübü Portalı",
        description: "Robotik, oyun geliştirme, uzay, yapay zekâ veya kendi seçtiğin teknoloji temasıyla özgün bir kulüp portalı oluştur.",
        requirements: [
          "DOCTYPE, lang, charset, title ve meta description.",
          "h1 ve mantıklı alt başlıklar; en az 3 section.",
          "En az bir list, figure + figcaption ve img + alt.",
          "En az dört bağlantı; bunlardan biri relative path olsun.",
          "En az bir button, bir SVG, bir audio/video ve bir iframe.",
        ],
      },
      starterCode: ``,
      tests: [
        doctype(),
        structure(),
        selector("meta-description", "Meta description var", 'meta[name="description"][content]'),
        selector("h1", "Bir ana başlık var", "h1"),
        count("sections", "En az üç section var", "section", 3),
        selector("list", "En az bir liste var", "ul, ol"),
        selector("figure", "Figure ve figcaption kullanılmış", "figure figcaption"),
        selector("image", "Erişilebilir bir görsel var", "img[alt]"),
        count("links", "En az dört bağlantı var", "a[href]", 4),
        selector("relative-link", "En az bir relative bağlantı var", 'a[href^="./"], a[href^="../"]'),
        selector("button", "En az bir button var", "button"),
        selector("svg", "En az bir inline SVG var", "svg[viewBox]"),
        selector("media", "En az bir audio veya video var", "audio, video"),
        selector("iframe", "En az bir iframe var", "iframe[src][title]"),
      ],
    }),
  ],
});

export const basicHtmlModule: CurriculumModule = {
  id: "basic-html",
  order: 1,
  title: "Basic HTML",
  description:
    "freeCodeCamp Responsive Web Design v9 Basic HTML akışındaki 137 adımı sekiz haftalık özgün pekiştirme programına dönüştürür. FCC'nin tema ve projelerini kopyalamaz; aynı kavramları yeni problemlerle tekrar ettirir.",
  totalFccSteps: 137,
  weeks: [week1, week2, week3, week4, week5, week6, week7, week8],
};
