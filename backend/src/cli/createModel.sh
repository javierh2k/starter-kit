#!/bin/bash
# ej: chmod +x new.sh
# ./new.sh photo
if [ "${OSTYPE//[0-9.]/}" == "darwin" ]
then
	sed="gsed"
elif  [ "${OSTYPE//[0-9.]/}" == "linux-gnu" ]
then
	sed="sed"
fi


FOLDER=$(echo $1 | tr [:lower:] [:upper:] )
echo $FOLDER
FOLDER_L=$(echo $FOLDER | tr [:upper:] [:lower:])
echo $FOLDER_L
FOLDER1=$(echo $FOLDER_L | $sed 's/^./\u&/')
echo $FOLDER1


cp -r user new/$FOLDER

echo "Carpetas USER"
        find new/$FOLDER -type d -name "*USER*"|while read DIR ; do echo "carpetas a renombrar $DIR" ; mv $DIR $(echo $DIR|sed "s/USER/${FOLDER}/") 2>/dev/null ;done
###############carpetas
for i in {1..3}; do
echo "Carpetas User"
        find new/$FOLDER -type d -name "*User*"|while read DIR ; do echo "carpetas a renombrar $DIR" ; mv $DIR $(echo $DIR|sed "s/User/${FOLDER1}/") 2>/dev/null ;done
echo "Carpetas user"
        find new/$FOLDER -type d -name "*user*"|while read DIR ; do echo "carpetas a renombrar $DIR" ; mv $DIR $(echo $DIR|sed "s/user/${FOLDER_L}/") 2>/dev/null ;done
done
#archivos
echo "Archivos USER"
        find new/$FOLDER -type f -name "*USER*"|while read FILE; do echo "archivos a renombrar $FILE"; mv $FILE $(echo $FILE|sed "s/USER/${FOLDER}/");done
        grep -lr USER new/* |while read DATA; do $sed -i "s/USER/${FOLDER}/g" $DATA; done

echo "Archivos User"
        find new/$FOLDER -type f -name "*User*"|while read FILE; do echo "archivos a renombrar $FILE"; mv $FILE $(echo $FILE|sed "s/User/${FOLDER1}/");done
        grep -lr User new/* |while read DATA; do $sed -i "s/User/${FOLDER1}/g" $DATA; done
echo "Archivos user"
        find new/$FOLDER -type f -name "*user*"|while read FILE; do echo "archivos a renombrar $FILE"; mv $FILE $(echo $FILE|sed "s/user/${FOLDER_L}/");done
        grep -lr user new/* |while read DATA; do $sed -i "s/user/${FOLDER_L}/g" $DATA; done

rsync -avz ./new/$FOLDER/* ../api/
rm -rf ./new/$FOLDER/
