Index = (function () {

    let baseUrl = "https://beer-production.herokuapp.com/";
    //let baseUrl = "http://localhost:3333/";
    let selectedUnity = {};
    
    return {

        Initialize: function () {

            document.getElementById('sltUnit').addEventListener('change', this.OnChangeUnity);
            document.getElementById('btnTransmit').addEventListener('click', this.TransmitProduction);
            
            this.FillUnityCombo();
        },

        FillUnityCombo: async function () {
            let unities = await Index.GetUnities();
            unities.unshift({ id: 0, name: 'Selecione' });
            let selectUnit = $('#sltUnit');
            $.each(unities, function (index, unity) {
                selectUnit.append(`<option value="${unity.id}">${unity.name}</option>`);
            });
        },

        FillLinesTab: function (lines) {
            let boxLines = $('.boxLines');
            $.each(lines, function (index, line) {
                boxLines.append(`<span class="lineTab" value="${line.id}">${line.name}</span>`);
            });

            $('.lineTab').click(this.OnClickLineTab);
        },

        OnChangeUnity: async function (event) {
            selectedUnity.id = event.target.value;
            selectedUnity.name = $('#sltUnit option:selected').text();
            
            let lines = await Index.GetLines(selectedUnity.id);
            Index.FillLinesTab(lines);
            
            let firstTab = $('.lineTab').eq(0);
            firstTab.addClass('selected');
            let lineId = firstTab.attr('value');

            Index.CheckProduction(lineId);
            
            $('.boxUnit').hide();
            $('.boxProd').show();
            $('.title').text(`Unidade: ${selectedUnity.name}. ${Index.GetFormattedCurrentDate()}`);
        },

        OnClickLineTab: async function (event) {
            event.preventDefault();

            if (!$(event.target).hasClass('selected')) {
                $('.boxInput').hide();
                //$('.load').css('display', 'block');
                
                let previousLineId = $('.lineTab.selected').attr('value');
                let previousLineName = $('.lineTab.selected').text();
                let clickedLineId = $(event.target).attr('value');
                let clickedLineName = $(event.target).text();

                $('.lineTab').removeClass('selected');
                $(event.target).addClass('selected');

                if (clickedLineName === 'Mosto') {
                    $('.boxLineInput').hide();
                    $('.boxLogInput').hide();
                    $('.boxCovidInput').hide();
                    $('.boxMostoInput').show();
                } else if (clickedLineName === 'Logística') {
                    $('.boxLineInput').hide();
                    $('.boxMostoInput').hide();
                    $('.boxCovidInput').hide();
                    $('.boxLogInput').show();
                } else if (clickedLineName === 'Covid') {
                    $('.boxLineInput').hide();
                    $('.boxLogInput').hide();
                    $('.boxMostoInput').hide();
                    $('.boxCovidInput').show();
                } else {
                    $('.boxMostoInput').hide();
                    $('.boxLogInput').hide();
                    $('.boxCovidInput').hide();
                    $('.boxLineInput').show();
                }

                let production = Index.GetFormData(previousLineId);
                let productionId;
                if (Index.ValidateProduction(production, previousLineName))
                    productionId = await Index.SaveProduction(production);

                Index.CheckProduction(clickedLineId);

                //$('.load').hide();
                $('.boxInput').fadeIn();
            }
        },

        CheckProduction: async function (lineId) {
            let production = await Index.GetCurrentProduction(lineId);
            if (production && production.length > 0)
                Index.FillProductionFields(production[0]);
            else
                $('.boxProd input[type="hidden"], .boxProd input[type="number"]').val('');
        },

        GetUnities: function () {
            return $.ajax({
                method: 'GET',
                url: baseUrl + 'units'
            });
            // .done(function (response) {
            //     return response;
            // });
        },

        GetLines: function (unityId) {
            return $.ajax({
                method: 'GET',
                url: baseUrl + 'lines/' + unityId
            });
        },

        GetCurrentProduction: function (lineId) {
            return $.ajax({
                method: 'GET',
                url: baseUrl + 'production/' + selectedUnity.id + '/' + lineId
            });
        },

        SaveProduction: function (production) {
            return $.ajax({
                method: production.id ? 'PUT' : 'POST',
                contentType: 'application/json',
                url: production.id ? baseUrl + 'production/' + production.id : baseUrl + 'production',
                data: JSON.stringify(production)
            });
        },

        TransmitProduction: async function () {
            let lineId = $('.lineTab.selected').attr('value');
            let lineName = $('.lineTab.selected').text();
            let production = Index.GetFormData(lineId);
            let productionId;
            if (Index.ValidateAllFieldsProduction(production, lineName)) {
                productionId = await Index.SaveProduction(production);
                if (productionId && (productionId.Id > 0 || productionId.resp > 0))
                    alert('Dados salvos com sucesso.');
            }
            else {
                alert('Atenção: Preencha todos os campos.');
            }
        },

        FillProductionFields: function (production) {
            document.querySelectorAll('input[name="id"]')[0].value = production.id;
            document.querySelectorAll('input[name="cap"]')[0].value = production.cap;
            document.querySelectorAll('input[name="prog_sap"]')[0].value = production.prog_sap;
            document.querySelectorAll('input[name="tend"]')[0].value = production.tend;
            document.querySelectorAll('input[name="prog_sap_d1"]')[0].value = production.prog_sap_d1;
            document.querySelectorAll('input[name="real_sap_d1"]')[0].value = production.real_sap_d1;
            document.querySelectorAll('input[name="lef_meta"]')[0].value = production.lef_meta;
            document.querySelectorAll('input[name="lef_real"]')[0].value = production.lef_real;
            document.querySelectorAll('input[name="gly_meta"]')[0].value = production.gly_meta;
            document.querySelectorAll('input[name="gly_real"]')[0].value = production.gly_real;
            document.querySelectorAll('input[name="dem"]')[0].value = production.dem;
            document.querySelectorAll('input[name="real"]')[0].value = production.real;
            document.querySelectorAll('input[name="retido_hl"]')[0].value = production.retido_hl;
            document.querySelectorAll('input[name="espaco"]')[0].value = production.espaco;
            document.querySelectorAll('input[name="acima_50_dias"]')[0].value = production.acima_50_dias;
            document.querySelectorAll('input[name="cdp_falta"]')[0].value = production.cdp_falta;
            document.querySelectorAll('input[name="terc"]')[0].value = production.terc;
            document.querySelectorAll('input[name="prop"]')[0].value = production.prop;
            document.querySelectorAll('input[name="media"]')[0].value = production.media;
            document.querySelectorAll('input[name="susp"]')[0].value = production.susp;
            document.querySelectorAll('input[name="conf"]')[0].value = production.conf;
            document.querySelectorAll('input[name="desc"]')[0].value = production.desc;
        },

        GetFormData: function (lineId) {
            let id = document.querySelectorAll('input[name="id"]')[0].value;
            let cap = document.querySelectorAll('input[name="cap"]')[0].value;
            let prog_sap = document.querySelectorAll('input[name="prog_sap"]')[0].value;
            let tend = document.querySelectorAll('input[name="tend"]')[0].value;
            let prog_sap_d1 = document.querySelectorAll('input[name="prog_sap_d1"]')[0].value;
            let real_sap_d1 = document.querySelectorAll('input[name="real_sap_d1"]')[0].value;
            let lef_meta = document.querySelectorAll('input[name="lef_meta"]')[0].value;
            let lef_real = document.querySelectorAll('input[name="lef_real"]')[0].value;
            let gly_meta = document.querySelectorAll('input[name="gly_meta"]')[0].value;
            let gly_real = document.querySelectorAll('input[name="gly_real"]')[0].value;
            let dem = document.querySelectorAll('input[name="dem"]')[0].value;
            let real = document.querySelectorAll('input[name="real"]')[0].value;
            let retido_hl = document.querySelectorAll('input[name="retido_hl"]')[0].value;
            let espaco = document.querySelectorAll('input[name="espaco"]')[0].value;
            let acima_50_dias = document.querySelectorAll('input[name="acima_50_dias"]')[0].value;
            let cdp_falta = document.querySelectorAll('input[name="cdp_falta"]')[0].value;
            let terc = document.querySelectorAll('input[name="terc"]')[0].value;
            let prop = document.querySelectorAll('input[name="prop"]')[0].value;
            let media = document.querySelectorAll('input[name="media"]')[0].value;
            let susp = document.querySelectorAll('input[name="susp"]')[0].value;
            let conf = document.querySelectorAll('input[name="conf"]')[0].value;
            let desc = document.querySelectorAll('input[name="desc"]')[0].value;
            let unit_id = selectedUnity.id;
	        let line_id = lineId;
            
            let production = {
                id,
                cap,
                prog_sap,
                tend,
                prog_sap_d1,
                real_sap_d1,
                lef_meta,
                lef_real,
                gly_meta,
                gly_real,
                unit_id,
                line_id,
                dem,
                real,
                retido_hl,
                espaco,
                acima_50_dias,
                cdp_falta,
                terc,
                prop,
                media,
                susp,
                conf,
	            desc
            }

            return production;
        },

        ValidateProduction: function (production, clickedLineName) {
            if (clickedLineName === 'Mosto') {
                if  (production.dem || production.real)
                    return true;
            } else if (clickedLineName === 'Logística') {
                if  (production.retido_hl || production.espaco || production.acima_50_dias || production.cdp_falta)
                    return true;
            } else if (clickedLineName === 'Covid') {
                if  (production.terc || production.prop || production.media || production.susp 
                    || production.conf || production.desc)
                    return true;
            } else {
                if  (production.cap || production.prog_sap || production.tend || production.prog_sap_d1 || production.real_sap_d1 
                    || production.lef_meta || production.lef_real || production.gly_meta || production.gly_real)
                    return true;
            }

            return false;
        },

        ValidateAllFieldsProduction: function (production, clickedLineName) {
            if (clickedLineName === 'Mosto') {
                if  (production.dem && production.real)
                    return true;
            } else if (clickedLineName === 'Logística') {
                if  (production.retido_hl && production.espaco && production.acima_50_dias && production.cdp_falta)
                    return true;
            } else if (clickedLineName === 'Covid') {
                if  (production.terc && production.prop && production.media && production.susp 
                    && production.conf && production.desc)
                    return true;
            } else {
                if  (production.cap && production.prog_sap && production.tend && production.prog_sap_d1 && production.real_sap_d1 
                    && production.lef_meta && production.lef_real && production.gly_meta && production.gly_real)
                    return true;
            }

            return false;
        },

        GetFormattedCurrentDate: function () {
            let d = new Date();
            let date = d.getDate();
            let month = d.getMonth() + 1;
            return 'Dia: ' + date + '/' + month;
        }
    }
})();