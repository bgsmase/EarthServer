//Namespace
var EarthServerGenericClient = EarthServerGenericClient || {};

/**
 * @class Scene Model: VoxelSlice
 * 1 URL for the service, 1 Coverage name data.
 * @augments EarthServerGenericClient.AbstractSceneModel
 */
EarthServerGenericClient.Model_VoxelSlice = function()
{
    this.setDefaults();
    this.name = "Voxel Coverage with displayed slices";
   
    /**
     * The custom or default WCPS Queries.
     * @type {Array}
     */
    this.WCPSQuery  = [];

    this.xSlices = [];
    this.ySlices = [];
    this.zSlices = [];

    this.coverageExpression = 'data';
};
EarthServerGenericClient.Model_VoxelSlice.inheritsFrom( EarthServerGenericClient.AbstractSceneModel );

/**
 * Sets the URL for the service.
 * @param url
 */
EarthServerGenericClient.Model_VoxelSlice.prototype.setURL=function(url){
    /**
     * URL for the WCPS service.
     * @type {String}
     */
    this.URLWCPS = String(url);
};
/**
 * Sets the coverage name (or array of names).
 * @param coverageVoxel - Coverage name (or array of names) for the layered data set.
 */
EarthServerGenericClient.Model_VoxelSlice.prototype.setCoverage = function (coverageVoxel) {
    /**
     * Name of the voxel coverage.
     * @type {String}
     */
    if (coverageVoxel instanceof Array)
    {
        this.coverageVoxel = coverageVoxel;
        var fe = 'c1 in ( ' + String(coverageVoxel[0]) + ' )';
        for (var i=1; i<coverageVoxel.length; i++)
        {
            fe = fe + ', c' + (i+1) + ' in ( ' + String(coverageVoxel[i]) + ' )';
        }
        this.forExpression = fe;
    }
    else
    {
        this.coverageVoxel = String(coverageVoxel);
        this.forExpression = 'data in ( ' + this.coverageVoxel + ' )';
    } 
};
/**
 * Sets the slice positions
 * @param slices
 */
EarthServerGenericClient.Model_VoxelSlice.prototype.setXSlices = function (slices) {
    /**
     * Queried slices.
     * @type {Array}
     */
    this.xSlices = slices;

    this.requests = this.xSlices.length + this.ySlices.length + this.zSlices.length;
};

EarthServerGenericClient.Model_VoxelSlice.prototype.setYSlices = function (slices) {
    /**
     * Queried slices.
     * @type {Array}
     */
    this.ySlices = slices;

    this.requests = this.xSlices.length + this.ySlices.length + this.zSlices.length;
};

EarthServerGenericClient.Model_VoxelSlice.prototype.setZSlices = function (slices) {
    /**
     * Queried slices.
     * @type {Array}
     */
    this.zSlices = slices;

    this.requests = this.xSlices.length + this.ySlices.length + this.zSlices.length;
};

EarthServerGenericClient.Model_VoxelSlice.prototype.setCoverageExpression = function (expr) {
    this.coverageExpression = expr;
}

/**
 * Specify the array of slice queries directly.
 * @param sliceQueries - the array of queries. Use $CI (coverageImage),
 * $MINX,$MINY,$MAXX,$MAXY(AoI) and $RESX,RESZ (Resolution) for automatic replacement.
 * Examples: $CI.red , x($MINX:$MINY)
 */
EarthServerGenericClient.Model_VoxelSlice.prototype.setWCPSSliceQueries = function(sliceQueries)
{
    this.WCPSQuery = sliceQueries;
};

/**
 * Sets the Coordinate Reference System.
 * @param value - eg. "http://www.opengis.net/def/crs/EPSG/0/27700"
 */
EarthServerGenericClient.Model_VoxelSlice.prototype.setCoordinateReferenceSystem = function(value)
{
    this.CRS = value;
};

/**
 * Creates the x3d geometry and appends it to the given root node. This is done automatically by the SceneManager.
 * @param root - X3D node to append the model.
 * @param cubeSizeX - Size of the fishtank/cube on the x-axis.
 * @param cubeSizeY - Size of the fishtank/cube on the y-axis.
 * @param cubeSizeZ - Size of the fishtank/cube on the z-axis.
 */
EarthServerGenericClient.Model_VoxelSlice.prototype.createModel=function(root, cubeSizeX, cubeSizeY, cubeSizeZ){
    if( root === undefined)
        alert("root is not defined");

    EarthServerGenericClient.MainScene.timeLogStart("Create Model " + this.name);

    this.cubeSizeX = cubeSizeX;
    this.cubeSizeY = cubeSizeY;
    this.cubeSizeZ = cubeSizeZ;

    this.root = root;

    // Check if mandatory values are set
    if( this.coverageVoxel === undefined || this.URLWCPS === undefined ||
        (this.xSlices.length === 0 && this.ySlices.length === 0 && this.zSlices.length === 0) )
    {
        alert("Not all mandatory values are set. VoxelSlice: " + this.name );
        console.log(this);
        return;
    }

    //IF something is not defined use standard query.
    //Not dealing with simultaneous slices in different directions yet.
    if( this.WCPSQuery.length === 0 )
    {
        var params = '';
        if (this.noData !== undefined && this.noData.length === 3)
        {
            params = ', "nodata='+this.noData[0]+','+this.noData[1]+','+this.noData[2]+'"'; 
        }
        var i = 0;
        for(var j=0; j< this.xSlices.length;j++)
        {
            this.WCPSQuery[i+j]  = "for " + this.forExpression + " ";
            this.WCPSQuery[i+j] += "return encode(slice( " + this.coverageExpression + ", {" + this.xAxisLabel + "(" + this.xSlices[j]+ ')}),"png"' + params +' )';
        }
        i = i + j;
        for(var j=0; j< this.ySlices.length;j++)
        {
            this.WCPSQuery[i+j]  = "for " + this.forExpression + " ";
            this.WCPSQuery[i+j] += "return encode(slice( " + this.coverageExpression + ", {" + this.yAxisLabel + "(" + this.ySlices[j]+ ')}),"png"' + params +' )';
        }
        i = i + j;
        for(var j=0; j< this.zSlices.length;j++)
        {
            this.WCPSQuery[i+j]  = "for " + this.forExpression + " ";
            this.WCPSQuery[i+j] += "return encode(slice( " + this.coverageExpression + ", {" + this.zAxisLabel + "(" + this.zSlices[j]+ ')}),"png"' + params +' )';
        }
    }
    else //ALL set so use custom query
    {
        this.replaceSymbolsInString(this.WCPSQuery);
    }

    // request data
    EarthServerGenericClient.requestWCPSImages(this,this.URLWCPS,this.WCPSQuery);
};
/**
 * This is a callback method as soon as the ServerRequest in createModel() has received it's data.
 * This is done automatically.
 * @param data - Received data array(!) from the ServerRequest.
 */
EarthServerGenericClient.Model_VoxelSlice.prototype.receiveData = function( data)
{
    var failedData = 0;
    for(var i=0;i<data.length;i++)
    {
        // TODO: delete only the one element and UI only if all failed.
        if( !this.checkReceivedData( data[i] ) )
            failedData++;
    }

    // if all data failed return
    if( failedData == data.length) return;

    // create transforms
    var XMinimum = 0, YMinimum = 0, ZMinimum = 0;
    var XMaximum = 1, YMaximum = 1, ZMaximum = 1;
    if (this.XMinimum) {
        XMinimum = this.XMinimum;
    } else if (this.xSlices.length > 0) {
    XMinimum = Math.min.apply(Math, this.xSlices);
    }
    if (this.XResolution) {
        XMaximum = XMinimum + this.XResolution;
    } else if (this.xSlices.length > 0){
        XMaximum = Math.max.apply(Math, this.xSlices);
    }
    if (this.YMinimum) {
        YMinimum = this.YMinimum;
    } else if (this.ySlices.length > 0) {
    YMinimum = Math.min.apply(Math, this.ySlices);
    }
    if (this.YResolution) {
        YMaximum = YMinimum + this.YResolution;
    } else if (this.ySlices.length > 0){
        YMaximum = Math.max.apply(Math, this.ySlices);
    }
    if (this.ZMinimum) {
        ZMinimum = this.ZMinimum;
    } else if (this.zSlices.length > 0) {
    ZMinimum = Math.min.apply(Math, this.zSlices);
    }
    if (this.ZResolution) {
        ZMaximum = ZMinimum + this.ZResolution;
    } else if (this.zSlices.length > 0){
        ZMaximum = Math.max.apply(Math, this.zSlices);
    }
    
    // Graphics Z axis positive out of screen but geographic y axis positive into it
    this.transformNode = this.createTransform(XMinimum,YMinimum,ZMaximum,XMaximum,YMaximum,ZMinimum);
    this.root.appendChild(this.transformNode);      

    // create terrain
    EarthServerGenericClient.MainScene.timeLogStart("Create Terrain " + this.name);
    this.terrain = new EarthServerGenericClient.VolumeSliceTerrain(this.transformNode,XMinimum,YMinimum,ZMaximum,XMaximum,YMaximum,ZMinimum,data,this.xSlices,this.ySlices,this.zSlices,this.index,this.noDataValue);
    EarthServerGenericClient.MainScene.timeLogEnd("Create Terrain " + this.name);

};

EarthServerGenericClient.Model_VoxelSlice.prototype.updateMaxShownElements = function(value)
{
    if( this.terrain !== undefined )
        this.terrain.updateMaxShownElements(value);
};

/**
 * Every Scene Model creates it's own specific UI elements. This function is called automatically by the SceneManager.
 * @param element - The element where to append the specific UI elements for this model.
 */
EarthServerGenericClient.Model_VoxelSlice.prototype.setSpecificElement= function(element)
{
    EarthServerGenericClient.appendMaxShownElementsSlider(element,this.index,this.requests);
};
