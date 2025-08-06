import { TencentCosHelper } from "./tencentCOShelper";

 async function  getAllEntity(querier, businessId) {
    const { claims , countryId} = querier;
    const { Business,Country, Entity, EntityContactPerson, EntityContactPersonMedia, EntityMedia } = MODELS;

    try {
      const list = await Entity.findAll({
        where:{
          businessId
        },
        include:[
          {
            model: EntityContactPerson,
            as: 'entityContactPerson',
            include:[
              {
                model: EntityContactPersonMedia
              }
            ]
          },
          {
            model: EntityMedia
          }
        ]
      });

      for(const each of list){
        for(const echMe of each.entityMedia){
            let cosHelper = new TencentCosHelper();
            const url = await cosHelper.getFile(echMe.filename);
            echMe['dataValues']['url'] = url; 
        }
      }

      return { ok: true, list  };
    } catch (error) {
      return Promise.resolve({ ok: false, error });
    }
  }