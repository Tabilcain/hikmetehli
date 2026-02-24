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
    "arabic": "﻿بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    "turkish": "Rahman Rahim olan Allah'ın adıyla"
  },
  {
    "surah": "Bakara",
    "surahNumber": 2,
    "ayahNumber": 152,
    "arabic": "فَٱذْكُرُونِىٓ أَذْكُرْكُمْ وَٱشْكُرُوا۟ لِى وَلَا تَكْفُرُونِ",
    "turkish": "Öyleyse (yalnızca) Beni anın, Ben de sizi anayım; ve (yalnızca) Bana şükredin ve (sakın) nankörlük etmeyin."
  },
  {
    "surah": "Bakara",
    "surahNumber": 2,
    "ayahNumber": 186,
    "arabic": "وَإِذَا سَأَلَكَ عِبَادِى عَنِّى فَإِنِّى قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ ٱلدَّاعِ إِذَا دَعَانِ ۖ فَلْيَسْتَجِيبُوا۟ لِى وَلْيُؤْمِنُوا۟ بِى لَعَلَّهُمْ يَرْشُدُونَ",
    "turkish": "Kullarım Beni sana soracak olursa, muhakkak ki Ben (onlara) pek yakınım. Bana dua ettiği zaman dua edenin duasına cevap veririm. Öyleyse, onlar da Benim çağrıma cevap versinler ve Bana iman etsinler. Umulur ki irşad (doğru yolu bulmuş) olurlar."
  },
  {
    "surah": "Bakara",
    "surahNumber": 2,
    "ayahNumber": 255,
    "arabic": "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ",
    "turkish": "Allah... O'ndan başka İlah yoktur. Diridir, Kaimdir. O'nu uyuklama ve uyku tutmaz. Göklerde ve yerde ne varsa hepsi O'nundur. İzni olmaksızın O'nun Katında şefaatte bulunacak kimdir? O, önlerindekini ve arkalarındakini bilir. (Onlar ise) Dilediği kadarının dışında, O'nun ilminden hiçbir şeyi kavrayıp-kuşatamazlar. O'nun kürsüsü, bütün gökleri ve yeri kaplayıp-kuşatmıştır. Onların korunması O'na güç gelmez. O, pek Yücedir, pek büyüktür."
  },
  {
    "surah": "Bakara",
    "surahNumber": 2,
    "ayahNumber": 286,
    "arabic": "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا ٱكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَآ إِن نَّسِينَآ أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَآ إِصْرًۭا كَمَا حَمَلْتَهُۥ عَلَى ٱلَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِۦ ۖ وَٱعْفُ عَنَّا وَٱغْفِرْ لَنَا وَٱرْحَمْنَآ ۚ أَنتَ مَوْلَىٰنَا فَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَٰفِرِينَ",
    "turkish": "Allah, hiç kimseye güç yetireceğinden başkasını yüklemez. (Kişinin nefsinin) Kazandığı lehine, kazandırdıkları aleyhinedir. \"Rabbimiz, unuttuklarımızdan veya yanıldıklarımızdan dolayı bizi sorumlu tutma. Rabbimiz, bize, bizden öncekilere yüklediğin gibi ağır yük yükleme. Rabbimiz, kendisine güç yetiremeyeceğimiz şeyi bize taşıtma. Bizi affet. Bizi bağışla. Bizi esirge, Sen bizim Mevlamızsın. Kafirler topluluğuna karşı bize yardım et.\""
  },
  {
    "surah": "Âl-i İmrân",
    "surahNumber": 3,
    "ayahNumber": 139,
    "arabic": "وَلَا تَهِنُوا۟ وَلَا تَحْزَنُوا۟ وَأَنتُمُ ٱلْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
    "turkish": "Gevşemeyin, üzülmeyin; eğer (gerçekten) iman etmişseniz en üstün olan sizlersiniz."
  },
  {
    "surah": "Âl-i İmrân",
    "surahNumber": 3,
    "ayahNumber": 159,
    "arabic": "فَبِمَا رَحْمَةٍۢ مِّنَ ٱللَّهِ لِنتَ لَهُمْ ۖ وَلَوْ كُنتَ فَظًّا غَلِيظَ ٱلْقَلْبِ لَٱنفَضُّوا۟ مِنْ حَوْلِكَ ۖ فَٱعْفُ عَنْهُمْ وَٱسْتَغْفِرْ لَهُمْ وَشَاوِرْهُمْ فِى ٱلْأَمْرِ ۖ فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى ٱللَّهِ ۚ إِنَّ ٱللَّهَ يُحِبُّ ٱلْمُتَوَكِّلِينَ",
    "turkish": "Allah'tan bir rahmet dolayısıyla, onlara yumuşak davrandın. Eğer kaba, katı yürekli olsaydın onlar çevrenden dağılır giderlerdi. Öyleyse onları bağışla, onlar için bağışlanma dile ve iş konusunda onlarla müşavere et. Eğer azmedersen artık Allah'a tevekkül et. Şüphesiz Allah, tevekkül edenleri sever."
  },
  {
    "surah": "Nisâ",
    "surahNumber": 4,
    "ayahNumber": 32,
    "arabic": "وَلَا تَتَمَنَّوْا۟ مَا فَضَّلَ ٱللَّهُ بِهِۦ بَعْضَكُمْ عَلَىٰ بَعْضٍۢ ۚ لِّلرِّجَالِ نَصِيبٌۭ مِّمَّا ٱكْتَسَبُوا۟ ۖ وَلِلنِّسَآءِ نَصِيبٌۭ مِّمَّا ٱكْتَسَبْنَ ۚ وَسْـَٔلُوا۟ ٱللَّهَ مِن فَضْلِهِۦٓ ۗ إِنَّ ٱللَّهَ كَانَ بِكُلِّ شَىْءٍ عَلِيمًۭا",
    "turkish": "Allah'ın kendisiyle kiminizi kiminize göre üstün kıldığı şeyi (malı) temenni etmeyin. Erkeklere kazandıklarından pay (olduğu gibi), kadınlara da kazandıklarından pay vardır. Allah'tan onun fazlını (ihsanını) isteyin. Gerçekten, Allah herşeyi bilendir."
  },
  {
    "surah": "Mâide",
    "surahNumber": 5,
    "ayahNumber": 2,
    "arabic": "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ لَا تُحِلُّوا۟ شَعَٰٓئِرَ ٱللَّهِ وَلَا ٱلشَّهْرَ ٱلْحَرَامَ وَلَا ٱلْهَدْىَ وَلَا ٱلْقَلَٰٓئِدَ وَلَآ ءَآمِّينَ ٱلْبَيْتَ ٱلْحَرَامَ يَبْتَغُونَ فَضْلًۭا مِّن رَّبِّهِمْ وَرِضْوَٰنًۭا ۚ وَإِذَا حَلَلْتُمْ فَٱصْطَادُوا۟ ۚ وَلَا يَجْرِمَنَّكُمْ شَنَـَٔانُ قَوْمٍ أَن صَدُّوكُمْ عَنِ ٱلْمَسْجِدِ ٱلْحَرَامِ أَن تَعْتَدُوا۟ ۘ وَتَعَاوَنُوا۟ عَلَى ٱلْبِرِّ وَٱلتَّقْوَىٰ ۖ وَلَا تَعَاوَنُوا۟ عَلَى ٱلْإِثْمِ وَٱلْعُدْوَٰنِ ۚ وَٱتَّقُوا۟ ٱللَّهَ ۖ إِنَّ ٱللَّهَ شَدِيدُ ٱلْعِقَابِ",
    "turkish": "Ey iman edenler, Allah'ın şiarlarına, haram olan ay'a, kurbanlık hayvanlara, (onlardaki) gerdanlıklara ve Rablerinden bir fazl ve hoşnutluk isteyerek Beyt-i Haram'a gelenlere sakın saygısızlık etmeyin. İhramdan çıktınız mı artık avlanabilirsiniz. Sizi Mescid-i Haram'dan alıkoyduklarından dolayı bir topluluğa olan kininiz, sakın sizi haddi aşmaya sürüklemesin. İyilik ve takva konusunda yardımlaşın, günah ve haddi aşmada yardımlaşmayın ve Allah'tan korkup-sakının. Gerçekten Allah (ceza ile) sonuçlandırması pek şiddetli olandır."
  },
  {
    "surah": "En'âm",
    "surahNumber": 6,
    "ayahNumber": 59,
    "arabic": "۞ وَعِندَهُۥ مَفَاتِحُ ٱلْغَيْبِ لَا يَعْلَمُهَآ إِلَّا هُوَ ۚ وَيَعْلَمُ مَا فِى ٱلْبَرِّ وَٱلْبَحْرِ ۚ وَمَا تَسْقُطُ مِن وَرَقَةٍ إِلَّا يَعْلَمُهَا وَلَا حَبَّةٍۢ فِى ظُلُمَٰتِ ٱلْأَرْضِ وَلَا رَطْبٍۢ وَلَا يَابِسٍ إِلَّا فِى كِتَٰبٍۢ مُّبِينٍۢ",
    "turkish": "Gaybın anahtarları O'nun Katındadır, O'ndan başka hiç kimse gaybı bilmez. Karada ve denizde olanların tümünü O bilir, O, bilmeksizin bir yaprak dahi düşmez; yerin karanlıklarındaki bir tane, yaş ve kuru dışta olmamak üzere hepsi (ve herşey) apaçık bir kitaptadır."
  },
  {
    "surah": "A'râf",
    "surahNumber": 7,
    "ayahNumber": 56,
    "arabic": "وَلَا تُفْسِدُوا۟ فِى ٱلْأَرْضِ بَعْدَ إِصْلَٰحِهَا وَٱدْعُوهُ خَوْفًۭا وَطَمَعًا ۚ إِنَّ رَحْمَتَ ٱللَّهِ قَرِيبٌۭ مِّنَ ٱلْمُحْسِنِينَ",
    "turkish": "Düzene konulması (ıslah)ından sonra yeryüzünde bozgunculuk (fesad) çıkarmayın; O'na korkarak ve umut taşıyarak dua edin. Doğrusu Allah'ın rahmeti iyilik yapanlara pek yakındır."
  },
  {
    "surah": "Enfâl",
    "surahNumber": 8,
    "ayahNumber": 46,
    "arabic": "وَأَطِيعُوا۟ ٱللَّهَ وَرَسُولَهُۥ وَلَا تَنَٰزَعُوا۟ فَتَفْشَلُوا۟ وَتَذْهَبَ رِيحُكُمْ ۖ وَٱصْبِرُوٓا۟ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ",
    "turkish": "Allah'a ve Resûlü’ne itaat edin ve çekişip birbirinize düşmeyin, çözülüp yılgınlaşırsınız, gücünüz gider. Sabredin. Şüphesiz Allah, sabredenlerle beraberdir."
  },
  {
    "surah": "Tevbe",
    "surahNumber": 9,
    "ayahNumber": 51,
    "arabic": "قُل لَّن يُصِيبَنَآ إِلَّا مَا كَتَبَ ٱللَّهُ لَنَا هُوَ مَوْلَىٰنَا ۚ وَعَلَى ٱللَّهِ فَلْيَتَوَكَّلِ ٱلْمُؤْمِنُونَ",
    "turkish": "De ki: \"Allah'ın bizim için yazdıkları dışında, bize kesinlikle hiçbir şey isabet etmez. O bizim Mevlamızdır. Ve mü'minler yalnızca Allah'a tevekkül etmelidirler.\""
  },
  {
    "surah": "Yûnus",
    "surahNumber": 10,
    "ayahNumber": 62,
    "arabic": "أَلَآ إِنَّ أَوْلِيَآءَ ٱللَّهِ لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ",
    "turkish": "Haberiniz olsun; Allah'ın velileri, onlar için korku yoktur, mahzun da olmayacaklardır."
  },
  {
    "surah": "Hûd",
    "surahNumber": 11,
    "ayahNumber": 6,
    "arabic": "۞ وَمَا مِن دَآبَّةٍۢ فِى ٱلْأَرْضِ إِلَّا عَلَى ٱللَّهِ رِزْقُهَا وَيَعْلَمُ مُسْتَقَرَّهَا وَمُسْتَوْدَعَهَا ۚ كُلٌّۭ فِى كِتَٰبٍۢ مُّبِينٍۢ",
    "turkish": "Yeryüzünde hiçbir canlı yoktur ki, rızkı Allah'a ait olmasın. Onun karar (yerleşik) yerini de ve geçici bulunduğu yeri de bilir. (Bunların) Tümü apaçık bir kitapta (yazılı)dır."
  },
  {
    "surah": "Yûsuf",
    "surahNumber": 12,
    "ayahNumber": 87,
    "arabic": "يَٰبَنِىَّ ٱذْهَبُوا۟ فَتَحَسَّسُوا۟ مِن يُوسُفَ وَأَخِيهِ وَلَا تَا۟يْـَٔسُوا۟ مِن رَّوْحِ ٱللَّهِ ۖ إِنَّهُۥ لَا يَا۟يْـَٔسُ مِن رَّوْحِ ٱللَّهِ إِلَّا ٱلْقَوْمُ ٱلْكَٰفِرُونَ",
    "turkish": "\"Oğullarım, gidin de Yusuf ile kardeşinden (duyarlı bir araştırmayla) bir haber getirin ve Allah'ın rahmetinden umut kesmeyin. Çünkü kafirler topluluğundan başkası Allah'ın rahmetinden umut kesmez.\""
  },
  {
    "surah": "Ra'd",
    "surahNumber": 13,
    "ayahNumber": 28,
    "arabic": "ٱلَّذِينَ ءَامَنُوا۟ وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ ٱللَّهِ ۗ أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ",
    "turkish": "Bunlar, iman edenler ve kalpleri Allah'ın zikriyle mutmain olanlardır. Haberiniz olsun; kalpler yalnızca Allah'ın zikriyle mutmain olur."
  },
  {
    "surah": "İbrâhîm",
    "surahNumber": 14,
    "ayahNumber": 7,
    "arabic": "وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِى لَشَدِيدٌۭ",
    "turkish": "\"Rabbiniz şöyle buyurmuştu: “Andolsun, eğer şükrederseniz gerçekten size artırırım ve andolsun, eğer nankörlük ederseniz, şüphesiz, Benim azabım pek şiddetlidir.\""
  },
  {
    "surah": "Nahl",
    "surahNumber": 16,
    "ayahNumber": 97,
    "arabic": "مَنْ عَمِلَ صَٰلِحًۭا مِّن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌۭ فَلَنُحْيِيَنَّهُۥ حَيَوٰةًۭ طَيِّبَةًۭ ۖ وَلَنَجْزِيَنَّهُمْ أَجْرَهُم بِأَحْسَنِ مَا كَانُوا۟ يَعْمَلُونَ",
    "turkish": "Erkek olsun, kadın olsun, bir mü'min olarak kim salih bir amelde bulunursa, hiç şüphesiz Biz onu güzel bir hayatla yaşatırız ve onların karşılığını, yaptıklarının en güzeliyle muhakkak veririz."
  },
  {
    "surah": "İsrâ",
    "surahNumber": 17,
    "ayahNumber": 23,
    "arabic": "۞ وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوٓا۟ إِلَّآ إِيَّاهُ وَبِٱلْوَٰلِدَيْنِ إِحْسَٰنًا ۚ إِمَّا يَبْلُغَنَّ عِندَكَ ٱلْكِبَرَ أَحَدُهُمَآ أَوْ كِلَاهُمَا فَلَا تَقُل لَّهُمَآ أُفٍّۢ وَلَا تَنْهَرْهُمَا وَقُل لَّهُمَا قَوْلًۭا كَرِيمًۭا",
    "turkish": "Rabbin, O'ndan başkasına kulluk etmemenizi ve anne-babaya iyilikle-davranmayı emretti. Şayet onlardan biri veya ikisi senin yanında yaşlılığa ulaşırsa, onlara: \"Öf\" bile deme ve onları azarlama; onlara güzel söz söyle."
  },
  {
    "surah": "Kehf",
    "surahNumber": 18,
    "ayahNumber": 10,
    "arabic": "إِذْ أَوَى ٱلْفِتْيَةُ إِلَى ٱلْكَهْفِ فَقَالُوا۟ رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةًۭ وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًۭا",
    "turkish": "O gençler, mağaraya sığındıkları zaman, demişlerdi ki: \"Rabbimiz, Katından bize bir rahmet ver ve işimizden bize doğruyu kolaylaştır (bizi başarılı kıl)."
  },
  {
    "surah": "Tâ-Hâ",
    "surahNumber": 20,
    "ayahNumber": 114,
    "arabic": "فَتَعَٰلَى ٱللَّهُ ٱلْمَلِكُ ٱلْحَقُّ ۗ وَلَا تَعْجَلْ بِٱلْقُرْءَانِ مِن قَبْلِ أَن يُقْضَىٰٓ إِلَيْكَ وَحْيُهُۥ ۖ وَقُل رَّبِّ زِدْنِى عِلْمًۭا",
    "turkish": "Hak olan, biricik hükümdar olan Allah Yücedir. Onun vahyi sana gelip-tamamlanmadan evvel, Kur'an'ı (okumada) acele etme ve de ki: \"Rabbim, ilmimi arttır.\""
  },
  {
    "surah": "Enbiyâ",
    "surahNumber": 21,
    "ayahNumber": 87,
    "arabic": "وَذَا ٱلنُّونِ إِذ ذَّهَبَ مُغَٰضِبًۭا فَظَنَّ أَن لَّن نَّقْدِرَ عَلَيْهِ فَنَادَىٰ فِى ٱلظُّلُمَٰتِ أَن لَّآ إِلَٰهَ إِلَّآ أَنتَ سُبْحَٰنَكَ إِنِّى كُنتُ مِنَ ٱلظَّٰلِمِينَ",
    "turkish": "Balık sahibi (Yunus'u da); hani o, kızmış vaziyette gitmişti ki; bundan dolayı kendisini sıkıntıya düşürmeyeceğimizi sanmıştı. (Balığın karnındaki) Karanlıklar içinde: \"Senden başka İlah yoktur, Sen Yücesin, gerçekten ben zulmedenlerden oldum\" diye çağrıda bulunmuştu."
  },
  {
    "surah": "Hac",
    "surahNumber": 22,
    "ayahNumber": 78,
    "arabic": "وَجَٰهِدُوا۟ فِى ٱللَّهِ حَقَّ جِهَادِهِۦ ۚ هُوَ ٱجْتَبَىٰكُمْ وَمَا جَعَلَ عَلَيْكُمْ فِى ٱلدِّينِ مِنْ حَرَجٍۢ ۚ مِّلَّةَ أَبِيكُمْ إِبْرَٰهِيمَ ۚ هُوَ سَمَّىٰكُمُ ٱلْمُسْلِمِينَ مِن قَبْلُ وَفِى هَٰذَا لِيَكُونَ ٱلرَّسُولُ شَهِيدًا عَلَيْكُمْ وَتَكُونُوا۟ شُهَدَآءَ عَلَى ٱلنَّاسِ ۚ فَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ٱلزَّكَوٰةَ وَٱعْتَصِمُوا۟ بِٱللَّهِ هُوَ مَوْلَىٰكُمْ ۖ فَنِعْمَ ٱلْمَوْلَىٰ وَنِعْمَ ٱلنَّصِيرُ",
    "turkish": "Allah adına gerektiği gibi mücadele edin. O, sizleri seçmiş ve din konusunda size bir güçlük yüklememiştir, atanız İbrahim'in dini(nde olduğu gibi). O (Allah) bundan daha önce de, bunda (Kur'an'da) da sizi \"Müslümanlar\" olarak isimlendirdi; elçi sizin üzerinize şahid olsun, siz de insanlar üzerine şahidler olasınız diye. Artık dosdoğru namazı kılın, zekatı verin ve Allah'a sarılın, sizin Mevlanız O'dur. İşte, ne güzel mevla ve ne güzel yardımcı."
  },
  {
    "surah": "Mü'minûn",
    "surahNumber": 23,
    "ayahNumber": 1,
    "arabic": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ قَدْ أَفْلَحَ ٱلْمُؤْمِنُونَ",
    "turkish": "Mü'minler gerçekten felah bulmuştur;"
  },
  {
    "surah": "Nûr",
    "surahNumber": 24,
    "ayahNumber": 35,
    "arabic": "۞ ٱللَّهُ نُورُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ ۚ مَثَلُ نُورِهِۦ كَمِشْكَوٰةٍۢ فِيهَا مِصْبَاحٌ ۖ ٱلْمِصْبَاحُ فِى زُجَاجَةٍ ۖ ٱلزُّجَاجَةُ كَأَنَّهَا كَوْكَبٌۭ دُرِّىٌّۭ يُوقَدُ مِن شَجَرَةٍۢ مُّبَٰرَكَةٍۢ زَيْتُونَةٍۢ لَّا شَرْقِيَّةٍۢ وَلَا غَرْبِيَّةٍۢ يَكَادُ زَيْتُهَا يُضِىٓءُ وَلَوْ لَمْ تَمْسَسْهُ نَارٌۭ ۚ نُّورٌ عَلَىٰ نُورٍۢ ۗ يَهْدِى ٱللَّهُ لِنُورِهِۦ مَن يَشَآءُ ۚ وَيَضْرِبُ ٱللَّهُ ٱلْأَمْثَٰلَ لِلنَّاسِ ۗ وَٱللَّهُ بِكُلِّ شَىْءٍ عَلِيمٌۭ",
    "turkish": "Allah, göklerin ve yerin nurudur. O'nun nurunun misali, içinde çerağ bulunan bir kandil gibidir; çerağ bir sırça içerisindedir; sırça, sanki incimsi bir yıldızdır ki, doğuya da, batıya da ait olmayan kutlu bir zeytin ağacından yakılır; (bu öyle bir ağaç ki) neredeyse ateş ona dokunmasa da yağı ışık verir. (Bu,) Nur üstüne nurdur. Allah, kimi dilerse onu Kendi nuruna yöneltip-iletir. Allah insanlar için örnekler verir. Allah, herşeyi bilendir."
  },
  {
    "surah": "Furkân",
    "surahNumber": 25,
    "ayahNumber": 74,
    "arabic": "وَٱلَّذِينَ يَقُولُونَ رَبَّنَا هَبْ لَنَا مِنْ أَزْوَٰجِنَا وَذُرِّيَّٰتِنَا قُرَّةَ أَعْيُنٍۢ وَٱجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    "turkish": "Ve onlar: \"Rabbimiz, bize eşlerimizden ve soyumuzdan, gözün aydınlığı olacak (çocuklar) armağan et ve bizi takva sahiplerine önder kıl,\" diyenlerdir."
  },
  {
    "surah": "Kasas",
    "surahNumber": 28,
    "ayahNumber": 24,
    "arabic": "فَسَقَىٰ لَهُمَا ثُمَّ تَوَلَّىٰٓ إِلَى ٱلظِّلِّ فَقَالَ رَبِّ إِنِّى لِمَآ أَنزَلْتَ إِلَىَّ مِنْ خَيْرٍۢ فَقِيرٌۭ",
    "turkish": "Hemencecik onların sürülerini suladı, sonra yine gölgeye çekilerek dedi ki: \"Rabbim, doğrusu bana indirdiğin her hayra muhtacım.\""
  },
  {
    "surah": "Ankebût",
    "surahNumber": 29,
    "ayahNumber": 69,
    "arabic": "وَٱلَّذِينَ جَٰهَدُوا۟ فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا ۚ وَإِنَّ ٱللَّهَ لَمَعَ ٱلْمُحْسِنِينَ",
    "turkish": "Bizim uğrumuzda cihad edenlere, şüphesiz yollarımızı gösteririz. Gerçekten Allah, ihsan edenlerle beraberdir."
  },
  {
    "surah": "Rûm",
    "surahNumber": 30,
    "ayahNumber": 21,
    "arabic": "وَمِنْ ءَايَٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًۭا لِّتَسْكُنُوٓا۟ إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةًۭ وَرَحْمَةً ۚ إِنَّ فِى ذَٰلِكَ لَءَايَٰتٍۢ لِّقَوْمٍۢ يَتَفَكَّرُونَ",
    "turkish": "Onda 'sükun bulup durulmanız' için, size kendi nefislerinizden eşler yaratması ve aranızda bir sevgi ve merhamet kılması da, O'nun ayetlerindendir. Şüphesiz bunda, düşünebilen bir kavim için gerçekten ayetler vardır."
  },
  {
    "surah": "Ahzâb",
    "surahNumber": 33,
    "ayahNumber": 56,
    "arabic": "إِنَّ ٱللَّهَ وَمَلَٰٓئِكَتَهُۥ يُصَلُّونَ عَلَى ٱلنَّبِىِّ ۚ يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ صَلُّوا۟ عَلَيْهِ وَسَلِّمُوا۟ تَسْلِيمًا",
    "turkish": "Şüphesiz, Allah ve melekleri Peygambere salat ederler. Ey iman edenler, siz de O'na salat edin ve tam bir teslimiyetle O'na selam verin."
  },
  {
    "surah": "Fâtır",
    "surahNumber": 35,
    "ayahNumber": 2,
    "arabic": "مَّا يَفْتَحِ ٱللَّهُ لِلنَّاسِ مِن رَّحْمَةٍۢ فَلَا مُمْسِكَ لَهَا ۖ وَمَا يُمْسِكْ فَلَا مُرْسِلَ لَهُۥ مِنۢ بَعْدِهِۦ ۚ وَهُوَ ٱلْعَزِيزُ ٱلْحَكِيمُ",
    "turkish": "Allah, insanlar için rahmetinden her neyi açacak olsa, artık onu kısıp-tutacak yoktur; her neyi kısar-tutarsa, artık onu da ondan sonra salıverecek yoktur. O, üstün ve güçlü olandır, hüküm ve hikmet sahibidir."
  },
  {
    "surah": "Yâsîn",
    "surahNumber": 36,
    "ayahNumber": 58,
    "arabic": "سَلَٰمٌۭ قَوْلًۭا مِّن رَّبٍّۢ رَّحِيمٍۢ",
    "turkish": "Çok esirgeyen Rabb'dan onlara bir de sözlü \"Selam\" (vardır)."
  },
  {
    "surah": "Zümer",
    "surahNumber": 39,
    "ayahNumber": 53,
    "arabic": "۞ قُلْ يَٰعِبَادِىَ ٱلَّذِينَ أَسْرَفُوا۟ عَلَىٰٓ أَنفُسِهِمْ لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ ۚ إِنَّ ٱللَّهَ يَغْفِرُ ٱلذُّنُوبَ جَمِيعًا ۚ إِنَّهُۥ هُوَ ٱلْغَفُورُ ٱلرَّحِيمُ",
    "turkish": "(Benden onlara) De ki: \"Ey kendi aleyhlerinde olmak üzere ölçüyü taşıran kullarım. Allah'ın rahmetinden umut kesmeyin. Şüphesiz Allah, bütün günahları bağışlar. Çünkü O, bağışlayandır, esirgeyendir.\""
  },
  {
    "surah": "Fussilet",
    "surahNumber": 41,
    "ayahNumber": 30,
    "arabic": "إِنَّ ٱلَّذِينَ قَالُوا۟ رَبُّنَا ٱللَّهُ ثُمَّ ٱسْتَقَٰمُوا۟ تَتَنَزَّلُ عَلَيْهِمُ ٱلْمَلَٰٓئِكَةُ أَلَّا تَخَافُوا۟ وَلَا تَحْزَنُوا۟ وَأَبْشِرُوا۟ بِٱلْجَنَّةِ ٱلَّتِى كُنتُمْ تُوعَدُونَ",
    "turkish": "Şüphesiz: \"Bizim Rabbimiz Allah'tır\" deyip sonra dosdoğru bir istikamet tutturanlar (yok mu); onların üzerine melekler iner (ve der ki:) \"Korkmayın ve hüzne kapılmayın, size vadolunan cennetle sevinin.\""
  },
  {
    "surah": "Şûrâ",
    "surahNumber": 42,
    "ayahNumber": 19,
    "arabic": "ٱللَّهُ لَطِيفٌۢ بِعِبَادِهِۦ يَرْزُقُ مَن يَشَآءُ ۖ وَهُوَ ٱلْقَوِىُّ ٱلْعَزِيزُ",
    "turkish": "Allah, kullarına karşı lütuf sahibidir; dilediğini rızıklandırır. O, kuvvetlidir, Azizdir."
  },
  {
    "surah": "Muhammed",
    "surahNumber": 47,
    "ayahNumber": 7,
    "arabic": "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ إِن تَنصُرُوا۟ ٱللَّهَ يَنصُرْكُمْ وَيُثَبِّتْ أَقْدَامَكُمْ",
    "turkish": "Ey iman edenler, eğer siz Allah'a (Allah adına İslama ve Müslümanlara) yardım ederseniz, O da size yardım eder ve sizin ayaklarınızı sağlamlaştırır."
  },
  {
    "surah": "Hucurât",
    "surahNumber": 49,
    "ayahNumber": 13,
    "arabic": "يَٰٓأَيُّهَا ٱلنَّاسُ إِنَّا خَلَقْنَٰكُم مِّن ذَكَرٍۢ وَأُنثَىٰ وَجَعَلْنَٰكُمْ شُعُوبًۭا وَقَبَآئِلَ لِتَعَارَفُوٓا۟ ۚ إِنَّ أَكْرَمَكُمْ عِندَ ٱللَّهِ أَتْقَىٰكُمْ ۚ إِنَّ ٱللَّهَ عَلِيمٌ خَبِيرٌۭ",
    "turkish": "Ey insanlar, gerçekten, Biz sizi bir erkek ve bir dişiden yarattık ve birbirinizle tanışmanız için sizi halklar ve kabileler (şeklinde) kıldık. Şüphesiz, Allah Katında sizin en üstün (kerim) olanınız, (ırk ya da soyca değil) takvaca en ileride olanınızdır. Şüphesiz Allah, bilendir, haber alandır."
  },
  {
    "surah": "Rahmân",
    "surahNumber": 55,
    "ayahNumber": 13,
    "arabic": "فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ",
    "turkish": "Şu halde Rabbinizin hangi nimetlerini yalanlayabilirsiniz?"
  },
  {
    "surah": "Hadîd",
    "surahNumber": 57,
    "ayahNumber": 4,
    "arabic": "هُوَ ٱلَّذِى خَلَقَ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ فِى سِتَّةِ أَيَّامٍۢ ثُمَّ ٱسْتَوَىٰ عَلَى ٱلْعَرْشِ ۚ يَعْلَمُ مَا يَلِجُ فِى ٱلْأَرْضِ وَمَا يَخْرُجُ مِنْهَا وَمَا يَنزِلُ مِنَ ٱلسَّمَآءِ وَمَا يَعْرُجُ فِيهَا ۖ وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ ۚ وَٱللَّهُ بِمَا تَعْمَلُونَ بَصِيرٌۭ",
    "turkish": "Gökleri ve yeri altı günde yaratan, sonra arşa istiva eden O'dur. Yere gireni, ondan çıkanı, gökten ineni ve ona çıkanı bilir. Her nerede iseniz, O sizinle beraberdir, Allah, yaptıklarınızı görendir."
  },
  {
    "surah": "Haşr",
    "surahNumber": 59,
    "ayahNumber": 22,
    "arabic": "هُوَ ٱللَّهُ ٱلَّذِى لَآ إِلَٰهَ إِلَّا هُوَ ۖ عَٰلِمُ ٱلْغَيْبِ وَٱلشَّهَٰدَةِ ۖ هُوَ ٱلرَّحْمَٰنُ ٱلرَّحِيمُ",
    "turkish": "O Allah ki, O'ndan başka İlah yoktur. Gaybı da, müşahede edilebileni de bilendir. Rahman, Rahim olan O'dur."
  },
  {
    "surah": "Talâk",
    "surahNumber": 65,
    "ayahNumber": 3,
    "arabic": "وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥٓ ۚ إِنَّ ٱللَّهَ بَٰلِغُ أَمْرِهِۦ ۚ قَدْ جَعَلَ ٱللَّهُ لِكُلِّ شَىْءٍۢ قَدْرًۭا",
    "turkish": "Ve onu hesaba katmadığı bir yönden rızıklandırır. Kim de Allah'a tevekkül ederse, O, ona yeter. Elbette Allah, Kendi emrini yerine getirip-gerçekleştirendir. Allah, herşey için bir ölçü kılmıştır."
  },
  {
    "surah": "Mülk",
    "surahNumber": 67,
    "ayahNumber": 1,
    "arabic": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ تَبَٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌ",
    "turkish": "Mülk elinde bulunan (Allah) ne Yücedir. O, herşeye güç yetirendir."
  },
  {
    "surah": "İnşirâh",
    "surahNumber": 94,
    "ayahNumber": 5,
    "arabic": "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
    "turkish": "Demek ki, gerçekten zorlukla beraber kolaylık vardır."
  },
  {
    "surah": "İnşirâh",
    "surahNumber": 94,
    "ayahNumber": 6,
    "arabic": "إِنَّ مَعَ ٱلْعُسْرِ يُسْرًۭا",
    "turkish": "Gerçekten güçlükle beraber kolaylık vardır."
  },
  {
    "surah": "Duha",
    "surahNumber": 93,
    "ayahNumber": 5,
    "arabic": "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰٓ",
    "turkish": "Elbette Rabbin sana verecek, böylece sen hoşnut kalacaksın."
  },
  {
    "surah": "İhlâs",
    "surahNumber": 112,
    "ayahNumber": 1,
    "arabic": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ قُلْ هُوَ ٱللَّهُ أَحَدٌ",
    "turkish": "De ki: O Allah, birdir."
  },
  {
    "surah": "Felak",
    "surahNumber": 113,
    "ayahNumber": 1,
    "arabic": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ",
    "turkish": "De ki: Sabahın Rabbine sığınırım."
  },
  {
    "surah": "Nâs",
    "surahNumber": 114,
    "ayahNumber": 1,
    "arabic": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ",
    "turkish": "De ki: İnsanların Rabbine sığınırım."
  }
];
