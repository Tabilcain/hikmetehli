// Kuran-ı Kerim'den seçme ayetler - Arapça metin ve Türkçe meal
export interface Verse {
  surah: string;
  surahNumber: number;
  ayahNumber: number;
  arabic: string;
  turkish: string;
}

export const verses: Verse[] = [
  {
    "surah": "Fatiha",
    "surahNumber": 1,
    "ayahNumber": 1,
    "arabic": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    "turkish": "Rahman Rahim olan Allah'ın adıyla"
  },
  {
    "surah": "Bakara",
    "surahNumber": 2,
    "ayahNumber": 152,
    "arabic": "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    "turkish": "Öyleyse (yalnızca) Beni anın, Ben de sizi anayım; ve (yalnızca) Bana şükredin ve (sakın) nankörlük etmeyin."
  },
  {
    "surah": "Bakara",
    "surahNumber": 2,
    "ayahNumber": 186,
    "arabic": "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    "turkish": "Kullarım Beni sana soracak olursa, muhakkak ki Ben (onlara) pek yakınım. Bana dua ettiği zaman dua edenin duasına cevap veririm. Öyleyse, onlar da Benim çağrıma cevap versinler ve Bana iman etsinler. Umulur ki irşad (doğru yolu bulmuş) olurlar."
  },
  {
    "surah": "Bakara",
    "surahNumber": 2,
    "ayahNumber": 255,
    "arabic": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
    "turkish": "Allah... O'ndan başka İlah yoktur. Diridir, Kaimdir. O'nu uyuklama ve uyku tutmaz. Göklerde ve yerde ne varsa hepsi O'nundur. İzni olmaksızın O'nun Katında şefaatte bulunacak kimdir? O, önlerindekini ve arkalarındakini bilir. (Onlar ise) Dilediği kadarının dışında, O'nun ilminden hiçbir şeyi kavrayıp-kuşatamazlar. O'nun kürsüsü, bütün gökleri ve yeri kaplayıp-kuşatmıştır. Onların korunması O'na güç gelmez. O, pek Yücedir, pek büyüktür."
  },
  {
    "surah": "Bakara",
    "surahNumber": 2,
    "ayahNumber": 286,
    "arabic": "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    "turkish": "Allah, hiç kimseye güç yetireceğinden başkasını yüklemez. (Kişinin nefsinin) Kazandığı lehine, kazandırdıkları aleyhinedir. \"Rabbimiz, unuttuklarımızdan veya yanıldıklarımızdan dolayı bizi sorumlu tutma. Rabbimiz, bize, bizden öncekilere yüklediğin gibi ağır yük yükleme. Rabbimiz, kendisine güç yetiremeyeceğimiz şeyi bize taşıtma. Bizi affet. Bizi bağışla. Bizi esirge, Sen bizim Mevlamızsın. Kafirler topluluğuna karşı bize yardım et.\""
  },
  {
    "surah": "Âl-i İmrân",
    "surahNumber": 3,
    "ayahNumber": 139,
    "arabic": "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
    "turkish": "Gevşemeyin, üzülmeyin; eğer (gerçekten) iman etmişseniz en üstün olan sizlersiniz."
  },
  {
    "surah": "Âl-i İmrân",
    "surahNumber": 3,
    "ayahNumber": 159,
    "arabic": "فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ",
    "turkish": "Allah'tan bir rahmet dolayısıyla, onlara yumuşak davrandın. Eğer kaba, katı yürekli olsaydın onlar çevrenden dağılır giderlerdi. Öyleyse onları bağışla, onlar için bağışlanma dile ve iş konusunda onlarla müşavere et. Eğer azmedersen artık Allah'a tevekkül et. Şüphesiz Allah, tevekkül edenleri sever."
  },
  {
    "surah": "Nisâ",
    "surahNumber": 4,
    "ayahNumber": 32,
    "arabic": "وَلَا تَتَمَنَّوْا مَا فَضَّلَ اللَّهُ بِهِ بَعْضَكُمْ عَلَىٰ بَعْضٍ",
    "turkish": "Allah'ın kendisiyle kiminizi kiminize göre üstün kıldığı şeyi (malı) temenni etmeyin. Erkeklere kazandıklarından pay (olduğu gibi), kadınlara da kazandıklarından pay vardır. Allah'tan onun fazlını (ihsanını) isteyin. Gerçekten, Allah herşeyi bilendir."
  },
  {
    "surah": "Mâide",
    "surahNumber": 5,
    "ayahNumber": 2,
    "arabic": "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ وَلَا تَعَاوَنُوا عَلَى الْإِثْمِ وَالْعُدْوَانِ",
    "turkish": "Ey iman edenler, Allah'ın şiarlarına, haram olan ay'a, kurbanlık hayvanlara, (onlardaki) gerdanlıklara ve Rablerinden bir fazl ve hoşnutluk isteyerek Beyt-i Haram'a gelenlere sakın saygısızlık etmeyin. İhramdan çıktınız mı artık avlanabilirsiniz. Sizi Mescid-i Haram'dan alıkoyduklarından dolayı bir topluluğa olan kininiz, sakın sizi haddi aşmaya sürüklemesin. İyilik ve takva konusunda yardımlaşın, günah ve haddi aşmada yardımlaşmayın ve Allah'tan korkup-sakının. Gerçekten Allah (ceza ile) sonuçlandırması pek şiddetli olandır."
  },
  {
    "surah": "En'âm",
    "surahNumber": 6,
    "ayahNumber": 59,
    "arabic": "وَعِندَهُ مَفَاتِحُ الْغَيْبِ لَا يَعْلَمُهَا إِلَّا هُوَ",
    "turkish": "Gaybın anahtarları O'nun Katındadır, O'ndan başka hiç kimse gaybı bilmez. Karada ve denizde olanların tümünü O bilir, O, bilmeksizin bir yaprak dahi düşmez; yerin karanlıklarındaki bir tane, yaş ve kuru dışta olmamak üzere hepsi (ve herşey) apaçık bir kitaptadır."
  },
  {
    "surah": "A'râf",
    "surahNumber": 7,
    "ayahNumber": 56,
    "arabic": "وَلَا تُفْسِدُوا فِي الْأَرْضِ بَعْدَ إِصْلَاحِهَا وَادْعُوهُ خَوْفًا وَطَمَعًا إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ",
    "turkish": "Düzene konulması (ıslah)ından sonra yeryüzünde bozgunculuk (fesad) çıkarmayın; O'na korkarak ve umut taşıyarak dua edin. Doğrusu Allah'ın rahmeti iyilik yapanlara pek yakındır."
  },
  {
    "surah": "Enfâl",
    "surahNumber": 8,
    "ayahNumber": 46,
    "arabic": "وَاصْبِرُوا إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    "turkish": "Allah'a ve Resûlü’ne itaat edin ve çekişip birbirinize düşmeyin, çözülüp yılgınlaşırsınız, gücünüz gider. Sabredin. Şüphesiz Allah, sabredenlerle beraberdir."
  },
  {
    "surah": "Tevbe",
    "surahNumber": 9,
    "ayahNumber": 51,
    "arabic": "قُل لَّن يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا هُوَ مَوْلَانَا وَعَلَى اللَّهِ فَلْيَتَوَكَّلِ الْمُؤْمِنُونَ",
    "turkish": "De ki: \"Allah'ın bizim için yazdıkları dışında, bize kesinlikle hiçbir şey isabet etmez. O bizim Mevlamızdır. Ve mü'minler yalnızca Allah'a tevekkül etmelidirler.\""
  },
  {
    "surah": "Yûnus",
    "surahNumber": 10,
    "ayahNumber": 62,
    "arabic": "أَلَا إِنَّ أَوْلِيَاءَ اللَّهِ لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ",
    "turkish": "Haberiniz olsun; Allah'ın velileri, onlar için korku yoktur, mahzun da olmayacaklardır."
  },
  {
    "surah": "Hûd",
    "surahNumber": 11,
    "ayahNumber": 6,
    "arabic": "وَمَا مِن دَابَّةٍ فِي الْأَرْضِ إِلَّا عَلَى اللَّهِ رِزْقُهَا",
    "turkish": "Yeryüzünde hiçbir canlı yoktur ki, rızkı Allah'a ait olmasın. Onun karar (yerleşik) yerini de ve geçici bulunduğu yeri de bilir. (Bunların) Tümü apaçık bir kitapta (yazılı)dır."
  },
  {
    "surah": "Yûsuf",
    "surahNumber": 12,
    "ayahNumber": 87,
    "arabic": "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ",
    "turkish": "\"Oğullarım, gidin de Yusuf ile kardeşinden (duyarlı bir araştırmayla) bir haber getirin ve Allah'ın rahmetinden umut kesmeyin. Çünkü kafirler topluluğundan başkası Allah'ın rahmetinden umut kesmez.\""
  },
  {
    "surah": "Ra'd",
    "surahNumber": 13,
    "ayahNumber": 28,
    "arabic": "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    "turkish": "Bunlar, iman edenler ve kalpleri Allah'ın zikriyle mutmain olanlardır. Haberiniz olsun; kalpler yalnızca Allah'ın zikriyle mutmain olur."
  },
  {
    "surah": "İbrâhîm",
    "surahNumber": 14,
    "ayahNumber": 7,
    "arabic": "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    "turkish": "\"Rabbiniz şöyle buyurmuştu: “Andolsun, eğer şükrederseniz gerçekten size artırırım ve andolsun, eğer nankörlük ederseniz, şüphesiz, Benim azabım pek şiddetlidir.\""
  },
  {
    "surah": "Nahl",
    "surahNumber": 16,
    "ayahNumber": 97,
    "arabic": "مَنْ عَمِلَ صَالِحًا مِّن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً",
    "turkish": "Erkek olsun, kadın olsun, bir mü'min olarak kim salih bir amelde bulunursa, hiç şüphesiz Biz onu güzel bir hayatla yaşatırız ve onların karşılığını, yaptıklarının en güzeliyle muhakkak veririz."
  },
  {
    "surah": "İsrâ",
    "surahNumber": 17,
    "ayahNumber": 23,
    "arabic": "وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا",
    "turkish": "Rabbin, O'ndan başkasına kulluk etmemenizi ve anne-babaya iyilikle-davranmayı emretti. Şayet onlardan biri veya ikisi senin yanında yaşlılığa ulaşırsa, onlara: \"Öf\" bile deme ve onları azarlama; onlara güzel söz söyle."
  },
  {
    "surah": "Kehf",
    "surahNumber": 18,
    "ayahNumber": 10,
    "arabic": "رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
    "turkish": "O gençler, mağaraya sığındıkları zaman, demişlerdi ki: \"Rabbimiz, Katından bize bir rahmet ver ve işimizden bize doğruyu kolaylaştır (bizi başarılı kıl)."
  },
  {
    "surah": "Tâ-Hâ",
    "surahNumber": 20,
    "ayahNumber": 114,
    "arabic": "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    "turkish": "Hak olan, biricik hükümdar olan Allah Yücedir. Onun vahyi sana gelip-tamamlanmadan evvel, Kur'an'ı (okumada) acele etme ve de ki: \"Rabbim, ilmimi arttır.\""
  },
  {
    "surah": "Enbiyâ",
    "surahNumber": 21,
    "ayahNumber": 87,
    "arabic": "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    "turkish": "Balık sahibi (Yunus'u da); hani o, kızmış vaziyette gitmişti ki; bundan dolayı kendisini sıkıntıya düşürmeyeceğimizi sanmıştı. (Balığın karnındaki) Karanlıklar içinde: \"Senden başka İlah yoktur, Sen Yücesin, gerçekten ben zulmedenlerden oldum\" diye çağrıda bulunmuştu."
  },
  {
    "surah": "Hac",
    "surahNumber": 22,
    "ayahNumber": 78,
    "arabic": "وَجَاهِدُوا فِي اللَّهِ حَقَّ جِهَادِهِ",
    "turkish": "Allah adına gerektiği gibi mücadele edin. O, sizleri seçmiş ve din konusunda size bir güçlük yüklememiştir, atanız İbrahim'in dini(nde olduğu gibi). O (Allah) bundan daha önce de, bunda (Kur'an'da) da sizi \"Müslümanlar\" olarak isimlendirdi; elçi sizin üzerinize şahid olsun, siz de insanlar üzerine şahidler olasınız diye. Artık dosdoğru namazı kılın, zekatı verin ve Allah'a sarılın, sizin Mevlanız O'dur. İşte, ne güzel mevla ve ne güzel yardımcı."
  },
  {
    "surah": "Mü'minûn",
    "surahNumber": 23,
    "ayahNumber": 1,
    "arabic": "قَدْ أَفْلَحَ الْمُؤْمِنُونَ",
    "turkish": "Mü'minler gerçekten felah bulmuştur;"
  },
  {
    "surah": "Nûr",
    "surahNumber": 24,
    "ayahNumber": 35,
    "arabic": "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ",
    "turkish": "Allah, göklerin ve yerin nurudur. O'nun nurunun misali, içinde çerağ bulunan bir kandil gibidir; çerağ bir sırça içerisindedir; sırça, sanki incimsi bir yıldızdır ki, doğuya da, batıya da ait olmayan kutlu bir zeytin ağacından yakılır; (bu öyle bir ağaç ki) neredeyse ateş ona dokunmasa da yağı ışık verir. (Bu,) Nur üstüne nurdur. Allah, kimi dilerse onu Kendi nuruna yöneltip-iletir. Allah insanlar için örnekler verir. Allah, herşeyi bilendir."
  },
  {
    "surah": "Furkân",
    "surahNumber": 25,
    "ayahNumber": 74,
    "arabic": "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    "turkish": "Ve onlar: \"Rabbimiz, bize eşlerimizden ve soyumuzdan, gözün aydınlığı olacak (çocuklar) armağan et ve bizi takva sahiplerine önder kıl,\" diyenlerdir."
  },
  {
    "surah": "Kasas",
    "surahNumber": 28,
    "ayahNumber": 24,
    "arabic": "رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
    "turkish": "Hemencecik onların sürülerini suladı, sonra yine gölgeye çekilerek dedi ki: \"Rabbim, doğrusu bana indirdiğin her hayra muhtacım.\""
  },
  {
    "surah": "Ankebût",
    "surahNumber": 29,
    "ayahNumber": 69,
    "arabic": "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا",
    "turkish": "Bizim uğrumuzda cihad edenlere, şüphesiz yollarımızı gösteririz. Gerçekten Allah, ihsan edenlerle beraberdir."
  },
  {
    "surah": "Rûm",
    "surahNumber": 30,
    "ayahNumber": 21,
    "arabic": "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
    "turkish": "Onda 'sükun bulup durulmanız' için, size kendi nefislerinizden eşler yaratması ve aranızda bir sevgi ve merhamet kılması da, O'nun ayetlerindendir. Şüphesiz bunda, düşünebilen bir kavim için gerçekten ayetler vardır."
  },
  {
    "surah": "Ahzâb",
    "surahNumber": 33,
    "ayahNumber": 56,
    "arabic": "إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ",
    "turkish": "Şüphesiz, Allah ve melekleri Peygambere salat ederler. Ey iman edenler, siz de O'na salat edin ve tam bir teslimiyetle O'na selam verin."
  },
  {
    "surah": "Fâtır",
    "surahNumber": 35,
    "ayahNumber": 2,
    "arabic": "مَّا يَفْتَحِ اللَّهُ لِلنَّاسِ مِن رَّحْمَةٍ فَلَا مُمْسِكَ لَهَا",
    "turkish": "Allah, insanlar için rahmetinden her neyi açacak olsa, artık onu kısıp-tutacak yoktur; her neyi kısar-tutarsa, artık onu da ondan sonra salıverecek yoktur. O, üstün ve güçlü olandır, hüküm ve hikmet sahibidir."
  },
  {
    "surah": "Yâsîn",
    "surahNumber": 36,
    "ayahNumber": 58,
    "arabic": "سَلَامٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ",
    "turkish": "Çok esirgeyen Rabb'dan onlara bir de sözlü \"Selam\" (vardır)."
  },
  {
    "surah": "Zümer",
    "surahNumber": 39,
    "ayahNumber": 53,
    "arabic": "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
    "turkish": "(Benden onlara) De ki: \"Ey kendi aleyhlerinde olmak üzere ölçüyü taşıran kullarım. Allah'ın rahmetinden umut kesmeyin. Şüphesiz Allah, bütün günahları bağışlar. Çünkü O, bağışlayandır, esirgeyendir.\""
  },
  {
    "surah": "Fussilet",
    "surahNumber": 41,
    "ayahNumber": 30,
    "arabic": "إِنَّ الَّذِينَ قَالُوا رَبُّنَا اللَّهُ ثُمَّ اسْتَقَامُوا تَتَنَزَّلُ عَلَيْهِمُ الْمَلَائِكَةُ أَلَّا تَخَافُوا وَلَا تَحْزَنُوا",
    "turkish": "Şüphesiz: \"Bizim Rabbimiz Allah'tır\" deyip sonra dosdoğru bir istikamet tutturanlar (yok mu); onların üzerine melekler iner (ve der ki:) \"Korkmayın ve hüzne kapılmayın, size vadolunan cennetle sevinin.\""
  },
  {
    "surah": "Şûrâ",
    "surahNumber": 42,
    "ayahNumber": 19,
    "arabic": "اللَّهُ لَطِيفٌ بِعِبَادِهِ يَرْزُقُ مَن يَشَاءُ وَهُوَ الْقَوِيُّ الْعَزِيزُ",
    "turkish": "Allah, kullarına karşı lütuf sahibidir; dilediğini rızıklandırır. O, kuvvetlidir, Azizdir."
  },
  {
    "surah": "Muhammed",
    "surahNumber": 47,
    "ayahNumber": 7,
    "arabic": "يَا أَيُّهَا الَّذِينَ آمَنُوا إِن تَنصُرُوا اللَّهَ يَنصُرْكُمْ وَيُثَبِّتْ أَقْدَامَكُمْ",
    "turkish": "Ey iman edenler, eğer siz Allah'a (Allah adına İslama ve Müslümanlara) yardım ederseniz, O da size yardım eder ve sizin ayaklarınızı sağlamlaştırır."
  },
  {
    "surah": "Hucurât",
    "surahNumber": 49,
    "ayahNumber": 13,
    "arabic": "يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا",
    "turkish": "Ey insanlar, gerçekten, Biz sizi bir erkek ve bir dişiden yarattık ve birbirinizle tanışmanız için sizi halklar ve kabileler (şeklinde) kıldık. Şüphesiz, Allah Katında sizin en üstün (kerim) olanınız, (ırk ya da soyca değil) takvaca en ileride olanınızdır. Şüphesiz Allah, bilendir, haber alandır."
  },
  {
    "surah": "Rahmân",
    "surahNumber": 55,
    "ayahNumber": 13,
    "arabic": "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",
    "turkish": "Şu halde Rabbinizin hangi nimetlerini yalanlayabilirsiniz?"
  },
  {
    "surah": "Hadîd",
    "surahNumber": 57,
    "ayahNumber": 4,
    "arabic": "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ وَاللَّهُ بِمَا تَعْمَلُونَ بَصِيرٌ",
    "turkish": "Gökleri ve yeri altı günde yaratan, sonra arşa istiva eden O'dur. Yere gireni, ondan çıkanı, gökten ineni ve ona çıkanı bilir. Her nerede iseniz, O sizinle beraberdir, Allah, yaptıklarınızı görendir."
  },
  {
    "surah": "Haşr",
    "surahNumber": 59,
    "ayahNumber": 22,
    "arabic": "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ هُوَ الرَّحْمَٰنُ الرَّحِيمُ",
    "turkish": "O Allah ki, O'ndan başka İlah yoktur. Gaybı da, müşahede edilebileni de bilendir. Rahman, Rahim olan O'dur."
  },
  {
    "surah": "Talâk",
    "surahNumber": 65,
    "ayahNumber": 3,
    "arabic": "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    "turkish": "Ve onu hesaba katmadığı bir yönden rızıklandırır. Kim de Allah'a tevekkül ederse, O, ona yeter. Elbette Allah, Kendi emrini yerine getirip-gerçekleştirendir. Allah, herşey için bir ölçü kılmıştır."
  },
  {
    "surah": "Mülk",
    "surahNumber": 67,
    "ayahNumber": 1,
    "arabic": "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    "turkish": "Mülk elinde bulunan (Allah) ne Yücedir. O, herşeye güç yetirendir."
  },
  {
    "surah": "İnşirâh",
    "surahNumber": 94,
    "ayahNumber": 5,
    "arabic": "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    "turkish": "Demek ki, gerçekten zorlukla beraber kolaylık vardır."
  },
  {
    "surah": "İnşirâh",
    "surahNumber": 94,
    "ayahNumber": 6,
    "arabic": "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    "turkish": "Gerçekten güçlükle beraber kolaylık vardır."
  },
  {
    "surah": "Duha",
    "surahNumber": 93,
    "ayahNumber": 5,
    "arabic": "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
    "turkish": "Elbette Rabbin sana verecek, böylece sen hoşnut kalacaksın."
  },
  {
    "surah": "İhlâs",
    "surahNumber": 112,
    "ayahNumber": 1,
    "arabic": "قُلْ هُوَ اللَّهُ أَحَدٌ",
    "turkish": "De ki: O Allah, birdir."
  },
  {
    "surah": "Felak",
    "surahNumber": 113,
    "ayahNumber": 1,
    "arabic": "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
    "turkish": "De ki: Sabahın Rabbine sığınırım."
  },
  {
    "surah": "Nâs",
    "surahNumber": 114,
    "ayahNumber": 1,
    "arabic": "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    "turkish": "De ki: İnsanların Rabbine sığınırım."
  }
];
