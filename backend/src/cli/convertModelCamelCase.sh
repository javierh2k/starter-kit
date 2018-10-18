#!/bin/bash
#####cambio nombre carpetas
FOLDER=$1
find $FOLDER -type f |while read FILE ;do 
NEW=$(echo $FILE | awk -F "/" '{print $2}' | gsed 's/^./\u&/')
MV=$(echo "$FOLDER/$NEW")
mv $FILE $MV
done

function REMPLAZAR () {
grep -l " $REMPL"  $FOLDER/* |awk -F ":" '{print $1}' | while read CAMBIO; do
#        echo "en: $CAMBIO  cambia $REMPL      por:  $REMPL_ALL   en     $FOLDER/$ARCH "
        gsed -i "s/ ${REMPL}/ ${REMPL_ALL}/g" $CAMBIO
done

grep -l "{$REMPL"  $FOLDER/* |awk -F ":" '{print $1}' | while read CAMBIO; do
#        echo "{{  en: $CAMBIO  cambia $REMPL      por:  $REMPL_ALL   en     $FOLDER/$ARCH "
        gsed -i "s/"\{${REMPL}"/"\{${REMPL_ALL}"/g" $CAMBIO
done

grep -l ">$REMPL"  $FOLDER/* |awk -F ":" '{print $1}' | while read CAMBIO; do
#        echo "  >> en: $CAMBIO  cambia $REMPL      por:  $REMPL_ALL   en     $FOLDER/$ARCH "
        gsed -i "/type=/ s/${REMPL}/${REMPL_ALL}/g" $CAMBIO
done

grep -l ":$REMPL"  $FOLDER/* |awk -F ":" '{print $1}' | while read CAMBIO; do
#        echo "  :: en: $CAMBIO  cambia $REMPL      por:  $REMPL_ALL   en     $FOLDER/$ARCH "
        gsed -i "s/:${REMPL}/:${REMPL_ALL}/g" $CAMBIO
done

grep -l "\.$REMPL"  $FOLDER/* |awk -F ":" '{print $1}' | while read CAMBIO; do
#        echo "  punto  en: $CAMBIO  cambia $REMPL      por:  $REMPL_ALL   en     $FOLDER/$ARCH "
        gsed -i "s/\.${REMPL}/\.${REMPL_ALL}/g" $CAMBIO
done

grep -l "\"$REMPL"  $FOLDER/* |awk -F ":" '{print $1}' | while read CAMBIO; do
#        echo "  comilla  en: $CAMBIO  cambia $REMPL      por:  $REMPL_ALL   en     $FOLDER/$ARCH "
        gsed -i "/@Entity/ n; s/\"${REMPL}/\"${REMPL_ALL}/g" $CAMBIO
done

grep -l "\/$REMPL"  $FOLDER/* |awk -F ":" '{print $1}' | while read CAMBIO; do
#        echo "  / en: $CAMBIO  cambia $REMPL      por:  $REMPL_ALL   en     $FOLDER/$ARCH "
        gsed -i "s/\/${REMPL}/\/${REMPL_ALL}/g" $CAMBIO
done

}

################## cambio dentro de archivos
find $FOLDER -type f | awk -F "/" '{print $2}'| grep "_" | grep Many | while read ARCH; do
REMPL=$(echo $ARCH | awk -F "." '{print $1}' | tr [:upper:] [:lower:])
#echo "==============================================================="
#echo $REMPL
REMPL_U=$(echo $REMPL | gsed 's/^./\u&/')
#echo $REMPL_U
REMPL_ALL=$(echo $REMPL_U |gsed 's/_\([a-z]\)/\u\1/g')

REMPLAZAR

done
################## cambio dentro de archivos
find $FOLDER -type f | awk -F "/" '{print $2}'| grep "_" |grep -v Many | while read ARCH; do
REMPL=$(echo $ARCH | awk -F "." '{print $1}' | tr [:upper:] [:lower:])
#echo "==============================================================="
#echo $REMPL
REMPL_U=$(echo $REMPL | gsed 's/^./\u&/')
#echo $REMPL_U
REMPL_ALL=$(echo $REMPL_U |gsed 's/_\([a-z]\)/\u\1/g')

REMPLAZAR

done
################## cambio dentro de archivos
find $FOLDER -type f | awk -F "/" '{print $2}'| grep -v "_" |grep -v Many | while read ARCH; do
REMPL=$(echo $ARCH | awk -F "." '{print $1}' | tr [:upper:] [:lower:])
#echo "==============================================================="
#echo $REMPL
REMPL_U=$(echo $REMPL | gsed 's/^./\u&/')
#echo $REMPL_U
REMPL_ALL=$(echo $REMPL_U |gsed 's/_\([a-z]\)/\u\1/g')

REMPLAZAR

done


############ integer x int

grep -l "\"integer\""  $FOLDER/* |awk -F ":" '{print $1}' | while read CAMBIO; do
#       echo " INTEGER  en: $CAMBIO  cambia INTEGER      por:  int   "
        gsed -i "/\"integer\"/ s/integer/int/g" $CAMBIO
done

########### uper files
find $FOLDER -type f  | while read FILE ;do mv $FILE $(echo $FILE |gsed 's/_\([a-z]\)/\u\1/g');done
