
var StudyViewInitScatterPlot = (function() { 
    var scatterPlot,
        scatterPlotArr = [],
        scatterPlotDataAttr = {},
        scatterPlotOptions = {};
    
    function initData(_arr) {
        var _datum = StudyViewInitCharts.getScatterPlotInitValue();
        
        $.each(_arr, function(i,value) {
            if( !isNaN(value['COPY_NUMBER_ALTERATIONS']) && 
                !isNaN(value['MUTATION_COUNT']) && 
                value['COPY_NUMBER_ALTERATIONS'] !== "" && 
                value['MUTATION_COUNT'] !== "") {                  
                    var _scatterPlotDatumTmp= {};
                    _scatterPlotDatumTmp.x_val = value['COPY_NUMBER_ALTERATIONS'];
                    _scatterPlotDatumTmp.y_val = value['MUTATION_COUNT'];
                    _scatterPlotDatumTmp.case_id = value['CASE_ID'];
                    _scatterPlotDatumTmp.qtip = "Case ID: <strong>" +
                        "<a href='tumormap.do?case_id=" +
                        value['CASE_ID'] + "&cancer_study_id=" +
                        StudyViewParams.params.studyId + "' target='_blank'>" + 
                        value['CASE_ID'] + "</a></strong>";
                    scatterPlotArr.push(_scatterPlotDatumTmp);
            }
        });
        
        scatterPlotDataAttr = jQuery.extend(true, {}, StudyViewBoilerplate.scatterPlotDataAttr);
        scatterPlotOptions = jQuery.extend(true, {}, StudyViewBoilerplate.scatterPlotOptions);    

        scatterPlotDataAttr.min_x = _datum.min_x;
        scatterPlotDataAttr.max_x = _datum.max_x;
        scatterPlotDataAttr.min_y = _datum.min_y;
        scatterPlotDataAttr.max_y = _datum.max_y;
    }
    
    function initComponent() {
        
        if(scatterPlotArr.length !== 0){
            scatterPlot = new ScatterPlots();
            scatterPlot.init(scatterPlotOptions, scatterPlotArr, scatterPlotDataAttr,true);            
            scatterPlot.jointBrushCallback(StudyViewInitCharts.scatterPlotBrushCallBack);
            scatterPlot.jointClickCallback(StudyViewInitCharts.scatterPlotClickCallBack);
            
            if(scatterPlotDataAttr.max_x > 1000){
                $("#" + scatterPlotOptions.names.log_scale_x).attr('checked',true);
                scatterPlot.updateScaleX(scatterPlotOptions.names.log_scale_x);
            }
            if(scatterPlotDataAttr.max_y > 1000){
                $("#" + scatterPlotOptions.names.log_scale_y).attr('checked',true);
                scatterPlot.updateScaleY(scatterPlotOptions.names.log_scale_y);
            }
           
            $("#" + scatterPlotOptions.names.log_scale_x).change(function() {
                scatterPlot.updateScaleX(scatterPlotOptions.names.log_scale_x);
            });
            $("#" + scatterPlotOptions.names.log_scale_y).change(function() {
                scatterPlot.updateScaleY(scatterPlotOptions.names.log_scale_y);
            });
            
            StudyViewUtil
                    .showHideDivision("#study-view-scatter-plot", 
                                    "#study-view-scatter-plot-header");
                                    
            StudyViewUtil
                    .showHideDivision("#study-view-scatter-plot", 
                            "#study-view-scatter-plot .study-view-drag-icon");
            
            
            $("#study-view-scatter-plot-pdf").submit(function(){
                setSVGElementValue("study-view-scatter-plot-body-svg",
                    "study-view-scatter-plot-pdf-value",
                    scatterPlotOptions);
            });
            $("#study-view-scatter-plot-svg").submit(function(){
                setSVGElementValue("study-view-scatter-plot-body-svg",
                    "study-view-scatter-plot-svg-value",
                    scatterPlotOptions);
            });
        }else{
            $('#study-view-scatter-plot').css('display','none');
        }
    }
    
    function setSVGElementValue(_svgParentDivId,_idNeedToSetValue,scatterPlotDataAttr){
        var svgElement;
        
        $("#" + _svgParentDivId + " .plots-title-x-help").remove();
        $("#" + _svgParentDivId + " .plots-title-y-help").remove();
        
        //Remove x/y title help icon first.
        svgElement = $("#" + _svgParentDivId).html();
        $("#" + _idNeedToSetValue).val(svgElement);
        scatterPlot.updateTitleHelp(scatterPlotDataAttr.names.log_scale_x, scatterPlotDataAttr.names.log_scale_y);
    }
    
    function initPage(){
        $("#study-view-charts").html("");
        $("#study-view-charts").append(StudyViewBoilerplate.scatterPlotDiv);
        $("#study-view-scatter-plot-pdf-name").val("Scatter_Plot_result-"+ StudyViewParams.params.studyId +".pdf");
        $("#study-view-scatter-plot-svg-name").val("Scatter_Plot_result-"+ StudyViewParams.params.studyId +".svg");
        $("#study-view-scatter-plot-header").css('display', 'none');
    }
    
    return {
        init: function(_arr) {
            initData(_arr);
            initPage();
            initComponent();
        },

        getScatterPlot: function() {
            if(scatterPlot === undefined){
                return false;
            }else{
                return scatterPlot;
            }
        }
    };
})();