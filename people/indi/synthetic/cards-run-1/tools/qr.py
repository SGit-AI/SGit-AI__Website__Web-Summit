import cv2,sys,glob
d=cv2.QRCodeDetector()
for f in sorted(glob.glob(sys.argv[1]+'/card-*-back.png')+glob.glob(sys.argv[1]+'/card-*-front.png')):
    v,_,_=d.detectAndDecode(cv2.imread(f)); print(f.split('/')[-1], repr(v))
