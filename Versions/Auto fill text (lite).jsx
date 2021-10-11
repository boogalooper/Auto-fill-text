// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<category>jazzy</category>
<enableinfo>true</enableinfo>
<eventid>122da95e-ef39-4387-a9ed-fcb24281d1e1</eventid>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING
#target photoshop

//bin
var lr = app.activeDocument.activeLayer
var outside = []
var inside = []
var minDist = []

var hs = app.activeDocument.activeHistoryState
var txt = getTextLayerIDs ()
app.activeDocument.activeHistoryState=hs

for (var i=0; i<txt.length; i++) 
{ 
    if (txt[i].visible==true) 
    {
        if (intersect (lr, txt[i])) {inside.push (new distance(lr, txt[i]))}
        else {outside.push(new distance(lr, txt[i]))}
     }
    }

if (inside.length>=1) {minDist=inside} else {minDist=outside}

if (minDist.length>=1)
{
    var min = minDist[0].dist
    var found=minDist[0].lr
    for (var i=1; i<minDist.length; i++)
    {
        if (minDist[i].dist<min) {min=minDist[i].dist; found=minDist[i].lr}
    }
}

var nm = lr.name.replace(/[^ А-яёЁ]/g, "")
var space = nm.split(" ")
var tmp = []
for (var i=0;i<space.length; i++) {if (space[i]!="") tmp.push (space[i])}
nm=""
for (var i=0;i<tmp.length-1; i++) {nm=nm+tmp[i]+'\r'}
nm=nm+tmp[tmp.length-1]

if (nm && found) found.textItem.contents =nm

app.activeDocument.activeLayer=lr

function intersect (lrA, lrB)
{    
    l1X =lrA.bounds[0].value
    l1Y=lrA.bounds[1].value
    r1X=lrA.bounds[2].value
    r1Y=lrA.bounds[3].value

    l2X =lrB.bounds[0].value
    l2Y=lrB.bounds[1].value
    r2X=lrB.bounds[2].value
    r2Y=lrB.bounds[3].value
          
    if (r2X < l1X || l2X > r1X) return false
    if (l2Y > r1Y || r2Y < l1Y) return false
     
    return true 
}

function distance (lrA, lrB)
{   
    
    l1X =lrA.bounds[0].value+ (lrA.bounds[2].value-lrA.bounds[0].value)/2
    l1Y=lrA.bounds[1].value+(lrA.bounds[3].value-lrA.bounds[1].value)/2

    l2X =lrB.bounds[0].value+(lrB.bounds[2].value-lrB.bounds[0].value)/2
    l2Y=lrB.bounds[1].value+(lrB.bounds[3].value-lrB.bounds[1].value)/2

    var a =l1X - l2X
    var b =l1Y - l2Y

    this.dist = Math.sqrt( a*a + b*b );
    this.lr = lrB
return
}
function selectLayerById (ID)
{
   var ref = new ActionReference();
   ref.putIdentifier(charIDToTypeID('Lyr '), ID);
   var desc = new ActionDescriptor();
   desc.putReference(charIDToTypeID('null'), ref);
   desc.putBoolean(charIDToTypeID('MkVs'), true);
   executeAction(charIDToTypeID('slct'), desc, DialogModes.NO);
   var lr = app.activeDocument.activeLayer
   return lr
}

function getTextLayerIDs(){     
   var ref = new ActionReference();     
   ref.putProperty( charIDToTypeID('Prpr') , charIDToTypeID('NmbL'));  
   ref.putEnumerated( charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );     
   var count = executeActionGet(ref).getInteger(charIDToTypeID('NmbL')) +1;     
   var Texts=[];    
try{    
    activeDocument.backgroundLayer;    
var i = 0; }catch(e){ var i = 1; };    
   for(i;i<count;i++){     
       if(i == 0) continue;    
        ref = new ActionReference();     
        ref.putIndex( charIDToTypeID( 'Lyr ' ), i );    
        var desc = executeActionGet(ref);      
        var ID = desc.getInteger(stringIDToTypeID( 'layerID' ));    
         if( desc.hasKey( stringIDToTypeID( 'textKey' ))) Texts.push(selectLayerById(ID));   
        }  
    return Texts  
};   