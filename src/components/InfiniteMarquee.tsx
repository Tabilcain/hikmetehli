import { motion } from "framer-motion";

const quotes = [
  "İlim öğrenmek her Müslümana farzdır.",
  "Hikmet, müminin yitiğidir; nerede bulursa alır.",
  "İlim Çin'de de olsa gidip öğreniniz.",
  "Beşikten mezara kadar ilim öğreniniz.",
  "Âlimin mürekkebi, şehidin kanından üstündür.",
  "İlim rütbesi, rütbelerin en yücesidir.",
  "Bir saat tefekkür, bir sene nafile ibadetten hayırlıdır.",
];

const separator = " ✦ ";

export const InfiniteMarquee = () => {
  const content = quotes.join(separator) + separator;

  return (
    <div className="relative w-full overflow-hidden py-10">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

      <div className="flex whitespace-nowrap">
        <motion.div
          className="flex whitespace-nowrap text-lg md:text-2xl font-display tracking-tight text-foreground/70"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              duration: 45,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          <span className="pr-6">{content}</span>
          <span className="pr-6">{content}</span>
        </motion.div>
      </div>
    </div>
  );
};
