#target photoshop

main ()

function main ()
{
    var doc = app.activeDocument
    hs = doc.activeHistoryState
    var lr = doc.activeLayer
    var minDist = []

    var l1X = lr.bounds[0].value; var l1Y = lr.bounds[1].value
    var r1X = lr.bounds[2].value; var r1Y = lr.bounds[3].value  
    var lrBounds = {X:l1X+ (r1X-l1X)/2, Y:l1Y+(r1Y-l1Y)/2}

    try {var desc = new ActionDescriptor()
    var ref = new ActionReference()
    ref.putEnumerated( charIDToTypeID( "Lyr " ), charIDToTypeID( "Ordn" ),  stringIDToTypeID( "hidden" ) )
    desc.putReference(charIDToTypeID( "null" ), ref )
    executeAction(charIDToTypeID( "Dlt " ), desc, DialogModes.NO ) } catch (e) {}
    
    var len = doc.artLayers.length
    var l1id = lr.id
    for (var i=0; i<len; i++) {var l2id =doc.artLayers[i].id; if (l2id != l1id) {minDist.push (new distance(lrBounds, doc.artLayers[i].bounds, l2id))} else {break}}

    minDist.sort (compareDist)  
    doc.activeHistoryState = hs

    selectLayer (lr.id, false)
    selectLayer (minDist[0].id, true)
    }

function compareDist (a,b) {if (a.dist > b.dist) return 1; if (a.dist < b.dist) return -1}

function distance (lrA, lrB, id)
{    
    var l2X =lrB[0].value; var l2Y=lrB[1].value
    var r2X=lrB[2].value; var r2Y=lrB[3].value
    
    var a =lrA.X - (l2X+(r2X-l2X)/2)
    var b =lrA.Y - (l2Y+(r2Y-l2Y)/2)

    this.dist = Math.sqrt( a*a + b*b )
    this.id = id
    
    return
}

 function selectLayer (ID, add) {
    add = (add == undefined)  ? add = false : add
   var ref = new ActionReference()
   ref.putIdentifier(charIDToTypeID('Lyr '), ID)
   var desc = new ActionDescriptor()
   desc.putReference(charIDToTypeID('null'), ref)
   if (add) {
      desc.putEnumerated(stringIDToTypeID('selectionModifier'), stringIDToTypeID('selectionModifierType'), stringIDToTypeID('addToSelection'))
   }
   desc.putBoolean(charIDToTypeID('MkVs'), false)
   executeAction(charIDToTypeID('slct'), desc, DialogModes.NO)
}